import path from 'path';

import { vscode } from './vsc';

// 基础目录
const base = (() => {
    const mainFilename = require.main?.filename;
    const vscodeInstallPath = vscode?.env.appRoot;
    const base = mainFilename?.length ? path.dirname(mainFilename) : path.join(vscodeInstallPath!, 'out');
    return base;
})();

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath('workbench.desktop.main.css');
    // https://github.com/microsoft/vscode/pull/141263
    const webPath = getCssPath('workbench.web.main.css');

    // See https://code.visualstudio.com/api/references/vscode-api#env
    switch (vscode?.env.appHost) {
        case 'desktop':
            return defPath;
        case 'web':
        default:
            return webPath;
    }
})();

// /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
const jsPath = path.join(base, 'vs/workbench/workbench.desktop.main.js');

export const vscodePath = {
    /**
     * 基础目录
     */
    base,
    extensionRoot: path.join(__dirname, '../../'),
    /**
     * css文件路径
     */
    cssPath,
    /**
     * js 文件地址
     */
    jsPath
};
