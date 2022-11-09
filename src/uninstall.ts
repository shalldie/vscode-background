/**
 * 1. 需要所有 vscode 进程退出，再打开，才会执行 `vscode:uninstall`
 * 2. 不能访问 vscode api
 *
 * https://github.com/microsoft/vscode/issues/155561
 * https://code.visualstudio.com/api/references/extension-manifest#extension-uninstall-hook
 */

/**
 * 使用的相关兼容性文件需要引用到具体文件，避免二次导出
 * 涉及文件：
 * `utils/vsc` // uninstall 中用到这个文件的
 * `background/CssFile`
 * `utils` 目录
 */

import fs from 'fs';
import { CssFile } from './background/CssFile';
import { TOUCH_FILE_PATH } from './constants';

async function uninstall() {
    try {
        const cssFilePath = (await fs.promises.readFile(TOUCH_FILE_PATH, 'utf-8')).trim();
        if (!cssFilePath) {
            return;
        }
        const file = new CssFile(cssFilePath);
        const hasInstalled = await file.hasInstalled();
        if (!hasInstalled) {
            return;
        }

        await file.uninstall();
        console.log('vscode background has been auto uninstalled.');
    } catch (ex: any) {
        console.error('vscode background uninstalled fail: ' + ex.message);
    }
}

uninstall();
