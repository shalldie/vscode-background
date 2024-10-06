import path from 'path';
import { vscode } from './vsc';

const getBase = () => {
    const mainFilename = require.main?.filename;
    const vscodeInstallPath = vscode?.env.appRoot;
    const base = mainFilename?.length ? path.dirname(mainFilename) : path.join(vscodeInstallPath!, 'out');
    return base;
};

// 基础目录
const base = getBase();

// css文件路径
const cssName = 'workbench.desktop.main.css';
// https://github.com/microsoft/vscode/pull/141263
const webCssName = 'workbench.web.main.css';

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath(cssName);
    const webPath = getCssPath(webCssName);

    // See https://code.visualstudio.com/api/references/vscode-api#env
    switch (vscode?.env.appHost) {
        case 'desktop':
            return defPath;
        case 'web':
        default:
            return webPath;
    }
})();

// electron 入口文件所在文件夹
const indexDir = path.join(base, 'vs', 'workbench', 'electron-browser', 'bootstrap');

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
    indexDir
};
