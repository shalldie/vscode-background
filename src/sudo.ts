import { exec } from '@vscode/sudo-prompt';

type SudoOption = { name?: string; icns?: string; env?: { [key: string]: string } };

/**
 * 提权运行命令
 * @param cmd 命令
 * @param options 选项
 * @returns 命令输出
 */
export const sudo = async (cmd: string, options: SudoOption = {}) =>
    new Promise((resolve, reject) =>
        exec(cmd, options, (error, stdout, stderr) => {
            if (error) reject(error);

            resolve([stdout, stderr]);
        })
    );
