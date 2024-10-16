import fs from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import vscode, { Disposable, Uri } from 'vscode';

import { ENCODING, EXTENSION_NAME, TOUCH_JSFILE_PATH, VERSION } from '../constants';
import { utils } from '../utils';
import { vscodePath } from '../utils/vscodePath';
import { vsHelp } from '../utils/vsHelp';
import { CssFile } from './CssFile';
import { EJsEditType, JsFile } from './JsFile';
import { PatchGenerator, TPatchGeneratorConfig } from './PatchGenerator';

/**
 * 配置类型
 */
type TConfigType = vscode.WorkspaceConfiguration & TPatchGeneratorConfig;

/**
 * 插件逻辑类
 *
 * @export
 * @class Background
 */
export class Background implements Disposable {
    // #region fields 字段

    /**
     * css文件操作对象
     *
     * @memberof Background
     */
    public cssFile = new CssFile(vscodePath.cssPath); // 没必要继承，组合就行

    public jsFile = new JsFile(vscodePath.jsPath);

    /**
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

    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private async checkFirstload(): Promise<boolean> {
        const firstLoad = !fs.existsSync(TOUCH_JSFILE_PATH);

        if (firstLoad) {
            // 提示
            this.showWelcome();
            // 标识插件已启动过
            await fs.promises.writeFile(TOUCH_JSFILE_PATH, vscodePath.jsPath, ENCODING);
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
            const imgPath = path.join(vscodePath.extensionRoot, 'images', relativePath);

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
        const targetPath = path.join(tmpdir(), 'welcome-to-background.md');
        await fs.promises.writeFile(targetPath, content, ENCODING);
        vscode.commands.executeCommand('markdown.showPreviewToSide', Uri.file(targetPath));
    }

    /**
     * 移除旧版本css文件中的patch
     *
     * @private
     * @return {*}
     * @memberof Background
     */
    private async removeLegacyCssPatch() {
        const hasInstalled = await this.cssFile.hasInstalled();
        if (!hasInstalled) {
            return;
        }
        await this.cssFile.uninstall();
    }

    /**
     * 配置改变，confirm 并提示应用&重启
     *
     * @private
     * @return {*}
     * @memberof Background
     */
    private async onConfigChange() {
        const hasInstalled = await this.jsFile.hasInstalled();
        const enabled = this.config.enabled;

        // 禁用
        if (!enabled) {
            if (hasInstalled) {
                await this.jsFile.uninstall();
                vsHelp.showInfoRestart('Background has been disabled! Please restart.');
            }
            return;
        }

        // 更新，需要二次确认
        const confirm = await vscode.window.showInformationMessage('Configuration has been changed, click to update.', {
            title: 'Update and restart'
        });

        if (!confirm) {
            return;
        }

        await this.applyPatch();
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    }

    public async applyPatch() {
        // 禁用时候，不处理
        if (!this.config.enabled) {
            return;
        }

        const scriptContent = PatchGenerator.create(this.config);

        await utils.lock();
        await this.jsFile.applyPatch(scriptContent);
        await utils.unlock();
    }

    // #endregion

    // #region public methods

    /**
     * 初始化
     *
     * @return {*}  {Promise<void>}
     * @memberof Background
     */
    public async setup(): Promise<void> {
        await this.removeLegacyCssPatch(); // 移除旧版本patch
        await this.checkFirstload(); // 是否初次加载插件

        const editType = await this.jsFile.getEditType(); // css 文件目前状态

        // 如果「开启」状态，文件不是「latest」，则进行更新
        if (this.config.enabled) {
            // 此时一般为 vscode更新、background更新
            if ([EJsEditType.IsOld, EJsEditType.NoModified].includes(editType)) {
                await this.applyPatch();
                vsHelp.showInfoRestart('Background has been changed! Please restart.');
            }
        }

        // 监听文件改变
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(ex => {
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
        return this.jsFile.hasInstalled();
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof Background
     */
    public async uninstall(): Promise<boolean> {
        await this.removeLegacyCssPatch();
        return this.jsFile.uninstall();
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
