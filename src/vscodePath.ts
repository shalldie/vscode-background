import fs from 'fs';
import path from 'path';
import vscode from 'vscode';

// 基础目录
const base = path.dirname(require.main.filename);

// css文件路径
const cssName = parseFloat(vscode.version) >= 1.38 ? 'workbench.desktop.main.css' : 'workbench.main.css';
// https://github.com/microsoft/vscode/pull/141263
const webCssName = 'workbench.web.main.css';

const cssPath = (() => {
    const getCssPath = (cssFileName: string) => path.join(base, 'vs', 'workbench', cssFileName);

    const defPath = getCssPath(cssName);
    const webPath = getCssPath(webCssName);

    /**
     * 暂时没想到怎么判断在 web 中使用，比如 code-server。暂时这么处理吧
     * 之后需要加上鉴权处理
     */
    if (!fs.existsSync(defPath) && fs.existsSync(webPath)) {
        return webPath;
    }

    return defPath;
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
