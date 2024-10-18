import { randomUUID } from 'crypto';
import fs, { constants as fsConstants } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import { utils } from '../../utils';
import { BACKGROUND_VER, ENCODING, VERSION } from '../../utils/constants';
import { vscode } from '../../utils/vsc';

export enum EFilePatchType {
    /**
     * 未修改的文件
     */
    None,
    /**
     * patch 过的旧版本文件
     */
    Legacy,
    /**
     * patch 过的新版本文件
     */
    Latest
}

/**
 * 文件 patch 操作
 *
 * @export
 * @abstract
 * @class AbsPatchFile
 */
export abstract class AbsPatchFile {
    constructor(private filePath: string) {}

    private get backupPath() {
        return this.filePath + '.background-backup';
    }

    public get hasBackup() {
        return fs.existsSync(this.backupPath);
    }

    /**
     * 初始化，创建备份
     *
     * @memberof AbsPatchFile
     */
    public async setup() {
        // 已包含备份文件，忽略
        if (this.hasBackup) {
            return;
        }

        await utils.lock();
        const content = await this.getContent();
        await this.saveContentTo(this.backupPath, content);
        await utils.unlock();
    }

    /**
     * 是否已经修改过
     *
     * @return {*}  {Promise<boolean>}
     * @memberof JsFile
     */
    public async hasPatched(): Promise<boolean> {
        const editType = await this.getPatchType();
        return editType !== EFilePatchType.None;
    }

    /**
     * 当前文件的修改状态
     *
     * @return {*}  {Promise<EPatchFileEditType>}
     * @memberof AbsPatchFile
     */
    public async getPatchType(): Promise<EFilePatchType> {
        const content = await this.getContent();

        // patch 过的新版本
        if (content.includes(`${BACKGROUND_VER}.${VERSION}`)) {
            return EFilePatchType.Latest;
        }

        // 包含 background.ver，patch 过的旧版本
        if (content.includes(BACKGROUND_VER)) {
            return EFilePatchType.Legacy;
        }

        return EFilePatchType.None;
    }

    protected async getBackup(): Promise<string> {
        if (!this.hasBackup) {
            console.error('backup file is missing: ' + this.backupPath);
            return '';
        }
        return fs.promises.readFile(this.backupPath, ENCODING);
    }

    protected getContent(): Promise<string> {
        return fs.promises.readFile(this.filePath, ENCODING);
    }

    private async saveContentTo(filePath: string, content: string) {
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.access(filePath, fsConstants.W_OK);
            }
            await fs.promises.writeFile(filePath, content, ENCODING);
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
            const tempFilePath = path.join(tmpdir(), `vscode-background-${randomUUID()}.temp`);
            await fs.promises.writeFile(tempFilePath, content, ENCODING);
            try {
                const mvcmd = process.platform === 'win32' ? 'move /Y' : 'mv -f';
                const cmdarg = `${mvcmd} "${tempFilePath}" "${filePath}"`;
                await utils.sudoExec(cmdarg, { name: 'Background Extension' });
                return true;
            } catch (e: any) {
                await vscode.window.showErrorMessage(e.message);
                return false;
            } finally {
                await fs.promises.rm(tempFilePath);
            }
        }
    }

    protected async write(content: string): Promise<boolean> {
        if (!content.trim().length) {
            return false;
        }
        return this.saveContentTo(this.filePath, content);
    }

    /**
     * 安装补丁到文件，需要包含 `${BACKGROUND_VER}.${VERSION}`
     *
     * @abstract
     * @param {string} patch
     * @return {*}  {Promise<void>}
     * @memberof AbsPatchFile
     */
    public abstract applyPatches(patch: string): Promise<void>;

    public async restore() {
        await utils.lock();
        const backup = await this.getBackup();
        const ok = await this.write(backup);
        await utils.unlock();
        return ok;
    }
}
