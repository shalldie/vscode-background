import lockfile from 'lockfile';
import { LOCK_PATH } from './constants';

/**
 * 工具包
 */
export const utils = {
    /**
     * 等待若干时间
     *
     * @param {number} [delay=0]
     * @return {*}
     */
    sleep(delay = 0) {
        return new Promise<void>(resolve => {
            setTimeout(resolve, delay);
        });
    },
    /**
     * 添加文件锁
     *
     * @return {*}
     */
    lock() {
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
    },
    /**
     * 取消文件锁
     *
     * @return {*}
     */
    unlock() {
        return new Promise<void>((resolve, reject) => {
            lockfile.unlock(LOCK_PATH, err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
};
