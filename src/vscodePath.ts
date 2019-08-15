import * as path from 'path';
import * as vscode from 'vscode';

// 基础目录
const base = path.dirname(require.main.filename);

// css文件路径
const cssName = vscode.version >= "1.38" ? 'workbench.desktop.main.css' : 'workbench.main.css';
const cssPath = path.join(base, 'vs', 'workbench', cssName);

// electron 入口文件所在文件夹
const indexDir = path.join(base, 'vs', 'workbench', 'electron-browser', 'bootstrap');

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
    indexDir
};