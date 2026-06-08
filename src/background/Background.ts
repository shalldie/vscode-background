import fs from 'fs';
import path from 'path';

import vscode, { Disposable, l10n } from 'vscode';

import { ENCODING, EXTENSION_NAME, TOUCH_FILE_PATH, VERSION } from '../utils/constants';
import { vscodePath } from '../utils/vscodePath';
import { vsHelp } from '../utils/vsHelp';
import { EFilePatchType, HtmlPatchFile, JsPatchFile } from './PatchFile';
import { PatchGenerator, TPatchGeneratorConfig } from './PatchGenerator';

/**
 * 配置类型
 */
type TConfigType = vscode.WorkspaceConfiguration & TPatchGeneratorConfig;

/**
 * 插件逻辑类
 * Extension logic
 *
 * @export
 * @class Background
 */
export class Background implements Disposable {
    // #region fields 字段

    public htmlFile = new HtmlPatchFile(vscodePath.workbenchHtmlPath);

    private legacyJsFile = new JsPatchFile(vscodePath.jsPath);

    /**
     * Current config
     * 当前用户配置
     *
     * @private
     * @type {TConfigType}
     * @memberof Background
     */
    public get config() {
        return vscode.workspace.getConfiguration('background') as TConfigType;
    }

    /**
     * 需要释放的资源
     *
     * @private
     * @type {Disposable[]}
     * @memberof Background
     */
    private disposables: Disposable[] = [];

    // #endregion

    // #region private methods 私有方法

    private async removeLegacyJsPatch() {
        try {
            const hasPatched = await this.legacyJsFile.hasPatched();
            if (!hasPatched) {
                return;
            }

            await this.legacyJsFile.restore();
        } catch {}
    }

    /**
     * 检测是否初次加载
     *
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private async checkFirstload(): Promise<boolean> {
        const firstLoad = !fs.existsSync(TOUCH_FILE_PATH);

        if (firstLoad) {
            await fs.promises.writeFile(TOUCH_FILE_PATH, vscodePath.workbenchHtmlPath, ENCODING);
            return true;
        }

        return false;
    }

    public async showWelcome() {
        // 欢迎页
        const docDir = path.join(__dirname, '../../docs');
        const docName = /^zh/.test(vscode.env.language) ? 'welcome.zh-CN.md' : 'welcome.md';

        // welcome 内容
        let content = await fs.promises.readFile(path.join(docDir, docName), ENCODING);
        // 替换图片内联为base64
        content = content.replace(/\.\.\/images[^\")]+/g, (relativePath: string) => {
            const imgPath = path.join(vscodePath.extRoot, 'images', relativePath);

            return (
                `data:image/${path.extname(imgPath).slice(1) || 'png'};base64,` +
                Buffer.from(fs.readFileSync(imgPath)).toString('base64')
            );
        });
        // 替换变量
        const paramsMap = {
            VERSION
        };
        for (const [key, value] of Object.entries(paramsMap)) {
            content = content.replaceAll('${' + key + '}', value);
        }
        vsHelp.showMarkdown(content, 'welcome');
    }

    /**
     * 配置改变，confirm 并提示应用&重启
     *
     * @private
     * @return {*}
     * @memberof Background
     */
    private async onConfigChange() {
        const hasInstalled = await this.hasInstalled();
        const enabled = this.config.enabled;

        // 禁用
        if (!enabled) {
            if (hasInstalled) {
                // await this.uninstall();

                vsHelp.reload({
                    message: l10n.t('Background will be disabled.'),
                    btnReload: l10n.t('Disable and Reload'),
                    beforeReload: () => this.uninstall()
                });
            }
            return;
        }

        // 更新，需要二次确认
        vsHelp.reload({
            message: l10n.t('Configuration has been changed, click to apply.'),
            btnReload: l10n.t('Apply and Reload'),
            beforeReload: () => this.applyPatch()
        });
    }

    public async applyPatch() {
        if (!this.config.enabled) {
            return;
        }

        const scriptContent = PatchGenerator.create(this.config);
        return this.htmlFile.applyPatches(scriptContent);
    }

    public previewPatch() {
        const scriptContent = PatchGenerator.create(this.config);
        vsHelp.showMarkdown('```ts\n' + scriptContent + '\n```', 'preview-patch');
    }

    // #endregion

    // #region public methods

    /**
     * 初始化
     *
     * @return {*}  {Promise<any>}
     * @memberof Background
     */
    public async setup(): Promise<any> {
        await this.removeLegacyJsPatch();

        await this.checkFirstload();

        const patchType = await this.htmlFile.getPatchType();

        // 如果「开启」状态，文件不是「latest」，则进行「提示更新」
        // 此时一般为 「background更新」、「vscode更新」
        const needApply = [EFilePatchType.Legacy, EFilePatchType.None].includes(patchType);
        if (this.config.enabled && needApply) {
            // 提示
            vscode.window
                .showInformationMessage(
                    l10n.t('Background@{version} is ready! Apply to take effect.', { version: VERSION }),
                    {
                        title: l10n.t('Apply and Reload'),
                        action: async () => {
                            await this.applyPatch();
                            await vsHelp.reload();
                        }
                    },
                    {
                        title: l10n.t('More'),
                        action: () => this.showWelcome()
                    }
                )
                .then(confirm => {
                    confirm?.action();
                });
        }
        // if ([EFilePatchType.Legacy, EFilePatchType.None].includes(patchType)) {
        //     // 提示： 欢迎使用 background@version! 「应用并重载」、「更多」
        //     if (await this.applyPatch()) {
        //         vsHelp.reload({
        //             message: l10n.t('Background has been changed! Please reload.')
        //         });
        //     }
        // }

        // 监听文件改变
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(async ex => {
                const hasChanged = ex.affectsConfiguration(EXTENSION_NAME);
                if (!hasChanged) {
                    return;
                }

                this.onConfigChange();
            })
        );
    }

    /**
     * 是否已安装
     *
     * @return {*}
     * @memberof Background
     */
    public hasInstalled(): Promise<boolean> {
        return this.htmlFile.hasPatched();
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof Background
     */
    public async uninstall(): Promise<boolean> {
        await this.removeLegacyJsPatch();
        return this.htmlFile.restore();
    }

    /**
     * 释放资源
     *
     * @memberof Background
     */
    public dispose(): void {
        this.disposables.forEach(n => n.dispose());
    }

    // #endregion
}
