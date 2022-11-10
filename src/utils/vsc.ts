/**
 * 给无 vscode api 的 case 使用
 * 比如 `vscode:uninstall`
 */

import VSCODE_BASE from 'vscode';

let vscode: typeof VSCODE_BASE | undefined;

try {
    vscode = require('vscode');
} catch {
    // nothing todo
}

export { vscode };
