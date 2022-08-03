import path from 'path';
import vscode from 'vscode';

// 基础目录
const base = path.dirname(require.main.filename);

// css文件路径
const cssName = 'workbench.desktop.main.css';
// https://github.com/microsoft/vscode/pull/141263
const webCssName = 'workbench.web.main.css';

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath(cssName);
    const webPath = getCssPath(webCssName);

    // See https://code.visualstudio.com/api/references/vscode-api#env
    switch (vscode.env.appHost) {
        case 'desktop':
            return defPath;
        case 'web':
        default:
            return webPath;
    }
})();

// electron 入口文件所在文件夹
const indexDir = path.join(base, 'vs', 'workbench', 'electron-browser', 'bootstrap');

const rootPath = path.join(base, '..');

const productPath = path.join(rootPath, 'product.json');

export const vscodePath = {
    /**
     * 基础目录
     */
    base,
    /**
     * css文件路径
     */
    cssPath,
    /**
     * electron 入口文件所在文件夹
     */
    indexDir,
    /**
     * VSCode app文件夹
     */
    rootPath,
    /**
     * product.json 文件的路径
     */
    productPath
};
