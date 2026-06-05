/**
 * 1. 需要所有 vscode 进程退出，再打开，才会执行 `vscode:uninstall`
 * 2. 不能访问 vscode api
 *
 * https://github.com/microsoft/vscode/issues/155561
 * https://code.visualstudio.com/api/references/extension-manifest#extension-uninstall-hook
 */

/**
 * 使用到的依赖需要引用到具体文件，避免二次导出
 */

import fs from 'fs';

import { HtmlPatchFile } from './background/PatchFile/PatchFile.html';
import { ENCODING, TOUCH_FILE_PATH } from './utils/constants';

async function uninstall() {
    try {
        const filePath = (await fs.promises.readFile(TOUCH_FILE_PATH, ENCODING)).trim();
        if (!filePath) {
            return;
        }

        await new HtmlPatchFile(filePath).restore();
        console.log('vscode background has been auto uninstalled.');
    } catch (ex: any) {
        console.error('vscode background uninstalled fail: ' + ex.message);
    }
}

uninstall();
