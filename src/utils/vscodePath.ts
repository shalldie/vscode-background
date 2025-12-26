import path from 'path';

import { _ } from './index';
import { vsc } from './vsc';

// 基础目录
const base = (() => {
    const mainFilename = require.main?.filename;
    const vscodeInstallPath = vsc?.env.appRoot;
    const base = mainFilename?.length ? path.dirname(mainFilename) : path.join(vscodeInstallPath!, 'out');
    return base;
})();

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath('workbench.desktop.main.css');
    // https://github.com/microsoft/vscode/pull/141263
    const webPath = getCssPath('workbench.web.main.css');

    if (_.isDesktop) {
        return defPath;
    }
    return webPath;
})();

const jsPath = (() => {
    // See https://code.visualstudio.com/api/references/vscode-api#env

    // desktop
    // /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
    if (_.isDesktop) {
        return path.join(base, 'vs/workbench/workbench.desktop.main.js');
    }

    // code-server
    // /usr/lib/code-server/lib/vscode/out/vs/code/browser/workbench/workbench.js
    return path.join(base, 'vs/code/browser/workbench/workbench.js');
})();

export const vscodePath = {
    /**
     * 基础目录
     */
    base,
    /**
     * 扩展根目录
     */
    extRoot: path.join(__dirname, '../../'),
    /**
     * css文件路径
     */
    cssPath,
    /**
     * js 文件地址
     */
    jsPath
};
