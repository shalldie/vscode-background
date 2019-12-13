import * as path from 'path';
import * as vscode from 'vscode';
import { execPath } from 'process'

// 基础目录
const base = path.dirname(require.main.filename);

// css文件路径
const cssName = parseFloat(vscode.version) >= 1.38 ? 'workbench.desktop.main.css' : 'workbench.main.css';
const cssPath = path.join(base, 'vs', 'workbench', cssName);

// electron 入口文件所在文件夹
const indexDir = path.join(base, 'vs', 'workbench', 'electron-browser', 'bootstrap');

function getCLIPath(): string {
    // TODO: 这两个变量不知道取的对不对
    let isBuilt = !process.env['VSCODE_DEV'];
    let appRoot = base;
    // TODO: 实在不知道怎么取了。。直接默认值
    let applicationName = 'code';
    // 下边代码来自vscode源码/src/vs/platform/environment/node/environmentService.ts line:48
    // Windows
    if (process.platform == 'win32') {
        if (isBuilt) {
            return path.join(path.dirname(execPath), 'bin', `${applicationName}.cmd`);
        }
        return path.join(appRoot, 'scripts', 'code-cli.bat');
    }
    // Linux
    if (process.platform == 'linux' || process.platform == 'android') {
        if (isBuilt) {
            return path.join(path.dirname(execPath), 'bin', `${applicationName}`);
        }
        return path.join(appRoot, 'scripts', 'code-cli.sh');
    }
    // macOS
    if (isBuilt) {
        return path.join(appRoot, 'bin', 'code');
    }
    return path.join(appRoot, 'scripts', 'code-cli.sh');
}

export default {
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
    getCLIPath
};
