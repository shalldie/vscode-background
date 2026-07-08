import fs from 'fs';
import path from 'path';

import { _ } from './index';
import { vsc } from './vsc';

// VS Code 安装根目录
// appRoot 示例：'/Applications/Visual Studio Code.app/Contents/Resources/app'
const appRoot = vsc?.env.appRoot ?? '';

const jsPath = (() => {
    // See https://code.visualstudio.com/api/references/vscode-api#env

    // desktop
    // /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
    if (_.isDesktop) {
        return path.join(appRoot, 'out/vs/workbench/workbench.desktop.main.js');
    }

    // code-server
    // /usr/lib/code-server/lib/vscode/out/vs/code/browser/workbench/workbench.js
    return path.join(appRoot, 'out/vs/code/browser/workbench/workbench.js');
})();

const workbenchHtmlPath = (() => {
    if (_.isDesktop) {
        // vscode
        const browserPath = path.join(appRoot, 'out/vs/code/electron-browser/workbench/workbench.html');
        // some version of Cursor use electron-sandbox
        const sandboxPath = path.join(appRoot, 'out/vs/code/electron-sandbox/workbench/workbench.html');
        return fs.existsSync(browserPath) ? browserPath : sandboxPath;
    }
    // code-server / web
    return path.join(appRoot, 'out/vs/code/browser/workbench/workbench.html');
})();

export const vscodePath = {
    /**
     * VS Code 安装根目录
     */
    appRoot,
    /**
     * 扩展根目录
     * 打包后运行于 dist/extension.js，__dirname 为 dist/
     */
    extRoot: path.join(__dirname, '../'),
    /**
     * js 文件地址
     */
    jsPath,
    /**
     * workbench.html 文件路径
     */
    workbenchHtmlPath
};
