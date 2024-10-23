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

import { JsPatchFile } from './background/PatchFile/PatchFile.javascript';
import { ENCODING, TOUCH_JSFILE_PATH } from './utils/constants';

async function uninstall() {
    try {
        const jsFilePath = (await fs.promises.readFile(TOUCH_JSFILE_PATH, ENCODING)).trim();
        if (!jsFilePath) {
            return;
        }
        const file = new JsPatchFile(jsFilePath);
        const hasPatched = await file.hasPatched();
        if (!hasPatched) {
            return;
        }

        await file.restore();
        console.log('vscode background has been auto uninstalled.');
    } catch (ex: any) {
        console.error('vscode background uninstalled fail: ' + ex.message);
    }
}

uninstall();
