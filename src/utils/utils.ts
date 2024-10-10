import sudo from '@vscode/sudo-prompt';
import lockfile from 'lockfile';

import { LOCK_PATH } from '../constants';

/**
 * 等待若干时间
 *
 * @param {number} [delay=0]
 * @return {*}
 */
function sleep(delay = 0) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, delay);
    });
}

/**
 * 添加文件锁
 *
 * @return {*}
 */
function lock() {
    return new Promise<void>((resolve, reject) => {
        lockfile.lock(
            LOCK_PATH,
            {
                wait: 5000 // 应该能撑200的并发了，，，>_<#@!
            },
            err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            }
        );
    });
}

/**
 * 取消文件锁
 *
 * @return {*}
 */
function unlock() {
    return new Promise<void>((resolve, reject) => {
        lockfile.unlock(LOCK_PATH, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

/**
 * 提权运行
 *
 * @param {string} cmd
 * @param {{ name?: string }} [options={}]
 * @return {*}  {Promise<any>}
 */
function sudoExec(cmd: string, options: { name?: string } = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        sudo.exec(cmd, options, (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => {
            if (error) {
                reject(error);
            }
            resolve([stdout, stderr]);
        });
    });
}

/**
 * 工具包
 */
export const utils = {
    sleep,
    lock,
    unlock,
    sudoExec
};
