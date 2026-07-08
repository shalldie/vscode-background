import fs from 'fs';
import path from 'path';

import { _ } from './index';
import { vsc } from './vsc';

// VS Code 安装根目录
// appRoot 示例：'/Applications/Visual Studio Code.app/Contents/Resources/app'
// See https://code.visualstudio.com/api/references/vscode-api#env
const appRoot = vsc?.env.appRoot ?? '';

/**
 * legacy js 文件地址（v2.1 之前 patch 注入到 JS 文件，现已迁移到 HTML）
 */
export function getLegacyJsPath() {
    // desktop
    // /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
    if (_.isDesktop) {
        return path.join(appRoot, 'out/vs/workbench/workbench.desktop.main.js');
    }

    // code-server
    // /usr/lib/code-server/lib/vscode/out/vs/code/browser/workbench/workbench.js
    return path.join(appRoot, 'out/vs/code/browser/workbench/workbench.js');
}

/**
 * workbench.html 文件路径
 */
export function getWorkbenchHtmlPath() {
    if (_.isDesktop) {
        // vscode
        const browserPath = path.join(appRoot, 'out/vs/code/electron-browser/workbench/workbench.html');
        // some version of Cursor use electron-sandbox
        const sandboxPath = path.join(appRoot, 'out/vs/code/electron-sandbox/workbench/workbench.html');
        return fs.existsSync(browserPath) ? browserPath : sandboxPath;
    }
    // code-server / web
    return path.join(appRoot, 'out/vs/code/browser/workbench/workbench.html');
}
