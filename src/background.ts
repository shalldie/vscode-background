// sys
import { tmpdir } from 'os';
import fs, { constants as fsConstants } from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// libs
import vscode, { Disposable } from 'vscode';
import sudo from 'sudo-prompt';

// self
import { vsHelp } from './vsHelp';
import { vscodePath } from './vscodePath';
import { VERSION, BACKGROUND_VER, ENCODE } from './constants';
import { CssGenerator, TCssGeneratorOptions } from './CssGenerator';

/**
 * 配置类型
 */
type TConfigType = vscode.WorkspaceConfiguration & TCssGeneratorOptions;

/**
 * css文件修改状态类型
 *
 * @enum {number}
 */
enum ECSSEditType {
    /**
     * 未修改的css文件
     */
    noModified,
    /**
     * hack 过的旧版本css文件
     */
    isOld,
    /**
     * hack 过的新版本的css文件
     */
    isNew
}

/**
 * 插件逻辑类
 *
 * @export
 * @class Background
 */
class Background implements Disposable {
    //#region private fields 私有字段

    /**
     * 当前用户配置
     *
     * @private
     * @type {TConfigType}
     * @memberof Background
     */
    private config: TConfigType = vscode.workspace.getConfiguration('background') as TConfigType;

    /**
     * 需要释放的资源
     *
     * @private
     * @type {Disposable[]}
     * @memberof Background
     */
    private disposables: Disposable[] = [];

    //#endregion

    //#region private methods 私有方法

    /**
     * 获取当前 css 文件的修改类型
     *
     * @return {*}  {Promise<ECSSEditType>}
     * @memberof Background
     */
    private async getFileType(): Promise<ECSSEditType> {
        if (!(await this.hasInstalled())) {
            return ECSSEditType.noModified;
        }

        const cssContent = await this.getCssContent();

        // hack 过的旧版本，即不包含当前版本
        const ifVerOld = !~cssContent.indexOf(`/*${BACKGROUND_VER}.${VERSION}*/`);

        if (ifVerOld) {
            return ECSSEditType.isOld;
        }

        // hack 过的新版本
        return ECSSEditType.isNew;
    }

    /**
     * 获取 css 文件内容
     *
     * @private
     * @returns {string}
     * @memberof Background
     */
    private getCssContent(): Promise<string> {
        return fsp.readFile(vscodePath.cssPath, ENCODE);
    }

    /**
     * 设置 css 文件内容
     *
     * @private
     * @param {string} content
     * @memberof Background
     */
    private async saveCssContent(content: string): Promise<boolean> {
        if (!content || !content.length) {
            return false;
        }
        try {
            await fsp.access(vscodePath.cssPath, fsConstants.W_OK);
            await fsp.writeFile(vscodePath.cssPath, content, ENCODE);
            return true;
        } catch (e) {
            // FIXME：
            // 一些系统会报错：Unable to find pkexec or kdesudo.
            // 相关 issue：https://github.com/jorangreef/sudo-prompt/pull/123
            // 测试环境： codercom/code-server:4.4.0
            // uname -a
            // Linux code-server-b6cc684df-sqx9h 5.4.0-77-generic #86-Ubuntu SMP Thu Jun 17 02:35:03 UTC 2021 x86_64 GNU/Linux
            const retry = 'Retry with Admin/Sudo';
            const result = await vscode.window.showErrorMessage(e.message, retry);
            if (result !== retry) {
                return false;
            }
            const tempFilePath = await this.saveCssContentToTemp(content);
            try {
                const mvcmd = process.platform === 'win32' ? 'move /Y' : 'mv -f';
                const cmdarg = `${mvcmd} "${tempFilePath}" "${vscodePath.cssPath}"`;
                await this.sudoCommand(cmdarg, { name: 'Visual Studio Code Background Extension' });
                return true;
            } catch (e) {
                await vscode.window.showErrorMessage(e.message);
                return false;
            } finally {
                await fsp.rm(tempFilePath);
            }
        }
    }

    /**
     * 提权运行命令
     *
     * @private
     * @param {string} cmd 命令
     * @param {{ name?: string }} [options={}] 选项
     * @return {*}  {Promise<any>} 命令输出
     * @memberof Background
     */
    private async sudoCommand(cmd: string, options: { name?: string } = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            sudo.exec(cmd, options, (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
                if (error) {
                    reject(error);
                }
                resolve([stdout, stderr]);
            });
        });
    }

    /**
     * 保存CSS到临时文件
     *
     * @private
     * @param content CSS文件内容
     * @returns 临时文件路径
     * @memberof Background
     */
    private async saveCssContentToTemp(content: string) {
        const tempPath = path.join(tmpdir(), `vscode-background-${randomUUID()}.css`);
        await fsp.writeFile(tempPath, content, ENCODE);
        return tempPath;
    }

    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private async checkFirstload(): Promise<boolean> {
        const versionTouchFile = path.join(__dirname, `../vscb.${VERSION}.touch`);

        const firstLoad = !fs.existsSync(versionTouchFile);

        if (firstLoad) {
            // 提示

            vscode.commands.executeCommand('extension.background.info');
            // 标识插件已启动过
            fsp.writeFile(versionTouchFile, '', ENCODE);

            return true;
        }

        return false;
    }

    /**
     * 安装插件，hack css
     *
     * @private
     * @param {boolean} [refresh] 需要强制更新
     * @returns {void}
     * @memberof Background
     */
    private async install(refresh?: boolean): Promise<void> {
        const lastConfig = this.config; // 之前的配置
        const config = vscode.workspace.getConfiguration('background') as TConfigType; // 当前用户配置

        // 1.如果配置文件改变的时候，当前插件配置没有改变，则返回
        if (!refresh && JSON.stringify(lastConfig) == JSON.stringify(config)) {
            // console.log('配置文件未改变.')
            return;
        }

        // 之后操作有两种：1.初次加载  2.配置文件改变

        // 2.两次配置均为，未启动插件
        if (!lastConfig.enabled && !config.enabled) {
            // console.log('两次配置均为，未启动插件');
            return;
        }

        // 3.保存当前配置
        this.config = config; // 更新配置

        // 4.如果关闭插件
        if (!config.enabled) {
            await this.uninstall();
            await vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
            return;
        }

        // 自定义的样式内容
        const content = (await CssGenerator.create(config)).trimEnd(); // 去除末尾空白

        // 添加到原有样式(尝试删除旧样式)中
        let cssContent = await this.getCssContent();
        cssContent = this.clearCssContent(cssContent);
        cssContent += content;

        if (await this.saveCssContent(cssContent)) {
            await vsHelp.showInfoRestart('Background has been changed! Please restart.');
        }
    }

    /**
     * 清理css中的添加项
     *
     * @private
     * @param {string} content
     * @returns {string}
     * @memberof Background
     */
    private clearCssContent(content: string): string {
        content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }

    //#endregion

    //#region public methods

    /**
     * 初始化
     *
     * @return {*}  {Promise<void>}
     * @memberof Background
     */
    public async setup(): Promise<void> {
        const firstload = await this.checkFirstload(); // 是否初次加载插件

        const fileType = await this.getFileType(); // css 文件目前状态

        // 如果是第一次加载插件，或者旧版本
        if (firstload || fileType == ECSSEditType.isOld || fileType == ECSSEditType.noModified) {
            await this.install(true);
        }

        // 监听文件改变
        this.disposables.push(vscode.workspace.onDidChangeConfiguration(() => this.install()));
    }

    /**
     * 是否已经安装过
     *
     * @return {*}  {Promise<boolean>}
     * @memberof Background
     */
    public async hasInstalled(): Promise<boolean> {
        const content = await this.getCssContent();
        if (!content) {
            return false;
        }

        return !!~content.indexOf(BACKGROUND_VER);
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof Background
     */
    public async uninstall(): Promise<boolean> {
        try {
            let content = await this.getCssContent();
            content = this.clearCssContent(content);
            return this.saveCssContent(content);
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }

    /**
     * 释放资源
     *
     * @memberof Background
     */
    public dispose() {
        this.disposables.forEach(n => n.dispose());
    }

    //#endregion
}

export const background = new Background();
