/**
 * 负责css文件的相关操作
 * 需要考虑无 vscode api 的情况
 */

import { randomUUID } from 'crypto';
import fs, { constants as fsConstants } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import { BACKGROUND_VER, ENCODING, VERSION } from '../constants';
import { utils } from '../utils';
import { vscode } from '../utils/vsc';

/**
 * css文件修改状态类型
 *
 * @export
 * @enum {number}
 */
export enum ECSSEditType {
    /**
     * 未修改的css文件
     */
    NoModified,
    /**
     * hack 过的旧版本css文件
     */
    IsOld,
    /**
     * hack 过的新版本的css文件
     */
    IsNew
}

/**
 * css 文件相关操作
 *
 * @deprecated
 * @export
 * @class CssFile
 */
export class CssFile {
    constructor(
        /**
         * 文件路径
         */
        private filePath: string
    ) {}

    /**
     * 获取当前 css 文件的修改类型
     *
     * @return {*}  {Promise<ECSSEditType>}
     * @memberof CssFile
     */
    public async getEditType(): Promise<ECSSEditType> {
        if (!(await this.hasInstalled())) {
            return ECSSEditType.NoModified;
        }

        const cssContent = await this.getContent();

        // hack 过的旧版本，即不包含当前版本
        const ifVerOld = !~cssContent.indexOf(`/*${BACKGROUND_VER}.${VERSION}*/`);

        if (ifVerOld) {
            return ECSSEditType.IsOld;
        }

        // hack 过的新版本
        return ECSSEditType.IsNew;
    }

    /**
     * 获取 css 文件内容
     *
     * @return {*}  {Promise<string>}
     * @memberof CssFile
     */
    public getContent(): Promise<string> {
        return fs.promises.readFile(this.filePath, ENCODING);
    }

    /**
     * 设置 css 文件内容
     *
     * @param {string} content
     * @return {*}  {Promise<boolean>}
     * @memberof CssFile
     */
    public async saveContent(content: string): Promise<boolean> {
        if (!content || !content.length) {
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
     * 保存CSS到临时文件
     *
     * @private
     * @param {string} content CSS文件内容
     * @return {*} 临时文件路径
     * @memberof CssFile
     */
    private async saveContentToTemp(content: string) {
        const tempPath = path.join(tmpdir(), `vscode-background-${randomUUID()}.css`);
        await fs.promises.writeFile(tempPath, content, ENCODING);
        return tempPath;
    }

    /**
     * 清理css中的添加项
     *
     * @param {string} content
     * @return {*}  {string}
     * @memberof CssFile
     */
    public clearContent(content: string): string {
        content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }

    /**
     * 是否已经安装过
     *
     * @return {*}  {Promise<boolean>}
     * @memberof CssFile
     */
    public async hasInstalled(): Promise<boolean> {
        const content = await this.getContent();
        if (!content) {
            return false;
        }

        return !!~content.indexOf(BACKGROUND_VER);
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof CssFile
     */
    public async uninstall(): Promise<boolean> {
        try {
            await utils.lock();
            let content = await this.getContent();
            content = this.clearContent(content);
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
