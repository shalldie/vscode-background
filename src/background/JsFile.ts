/**
 * 负责js文件的相关操作
 * 需要考虑无 vscode api 的情况
 */

import { randomUUID } from 'crypto';
import fs, { constants as fsConstants } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import { BACKGROUND_VER, ENCODING, VERSION } from '../constants';
import { utils } from '../utils';
import { vscode } from '../utils/vsc';

// vscode-background-start background.ver.2.0.0
// vscode-background-end

/**
 * js文件修改状态类型
 *
 * @export
 * @enum {number}
 */
export enum EJsEditType {
    /**
     * 未修改的js文件
     */
    NoModified,
    /**
     * patch 过的旧版本js文件
     */
    IsOld,
    /**
     * patch 过的新版本的js文件
     */
    Latest
}

/**
 * js 文件相关操作
 *
 * @export
 * @class JsFile
 */
export class JsFile {
    constructor(
        /**
         * 文件路径
         */
        private filePath: string
    ) {}

    /**
     * 获取当前 js 文件的修改状态
     *
     * @return {*}  {Promise<EJsEditType>}
     * @memberof JsFile
     */
    private async getEditType(): Promise<EJsEditType> {
        const hasInstalled = await this.hasInstalled();
        if (!hasInstalled) {
            return EJsEditType.NoModified;
        }

        // hack 过的旧版本，即不包含当前版本
        const content = await this.getContent();
        const ifVerOld = !content.includes(`${BACKGROUND_VER}.${VERSION}`);

        if (ifVerOld) {
            return EJsEditType.IsOld;
        }

        // hack 过的新版本
        return EJsEditType.Latest;
    }

    /**
     * 获取 css 文件内容
     *
     * @return {*}  {Promise<string>}
     * @memberof JsFile
     */
    private getContent(): Promise<string> {
        return fs.promises.readFile(this.filePath, ENCODING);
    }

    public async applyPatch(patchContent: string) {
        if (!patchContent.length) {
            return;
        }

        let content = await this.getContent();
        content = this.clearPatches(content);
        content += [
            //
            `\n// vscode-background-start ${BACKGROUND_VER}.${VERSION}`,
            patchContent,
            '// vscode-background-end'
        ].join('\n');

        this.saveContent(content);
    }

    /**
     * 设置 js 文件内容
     *
     * @param {string} content
     * @return {*}  {Promise<boolean>}
     * @memberof JsFile
     */
    private async saveContent(content: string): Promise<boolean> {
        if (!content.trim().length) {
            return false;
        }
        try {
            await fs.promises.access(this.filePath, fsConstants.W_OK);
            await fs.promises.writeFile(this.filePath, content, ENCODING);
            return true;
        } catch (e: any) {
            if (!vscode) {
                return false;
            }
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
            const tempFilePath = await this.saveContentToTemp(content);
            try {
                const mvcmd = process.platform === 'win32' ? 'move /Y' : 'mv -f';
                const cmdarg = `${mvcmd} "${tempFilePath}" "${this.filePath}"`;
                await utils.sudoExec(cmdarg, { name: 'Visual Studio Code Background Extension' });
                return true;
            } catch (e: any) {
                await vscode.window.showErrorMessage(e.message);
                return false;
            } finally {
                await fs.promises.rm(tempFilePath);
            }
        }
    }

    /**
     * 保存js到临时文件
     *
     * @private
     * @param {string} content CSS文件内容
     * @return {*} 临时文件路径
     * @memberof JsFile
     */
    private async saveContentToTemp(content: string) {
        const tempPath = path.join(tmpdir(), `vscode-background-${randomUUID()}.js`);
        await fs.promises.writeFile(tempPath, content, ENCODING);
        return tempPath;
    }

    /**
     * 清理js中的添加项
     *
     * @param {string} content
     * @return {*}  {string}
     * @memberof JsFile
     */
    public clearPatches(content: string): string {
        return content.replace(/\n\/\/ vscode-background-start[\S\s]*vscode-background-end/, '');
    }

    /**
     * 是否已经安装过
     *
     * @return {*}  {Promise<boolean>}
     * @memberof JsFile
     */
    public async hasInstalled(): Promise<boolean> {
        const content = await this.getContent();
        if (!content) {
            return false;
        }

        return content.includes(BACKGROUND_VER);
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof JsFile
     */
    public async uninstall(): Promise<boolean> {
        try {
            await utils.lock();
            let content = await this.getContent();
            content = this.clearPatches(content);
            // 异常case return
            if (!content.trim().length) {
                return false;
            }
            return this.saveContent(content);
        } catch (ex) {
            console.log(ex);
            return false;
        } finally {
            await utils.unlock();
        }
    }
}
