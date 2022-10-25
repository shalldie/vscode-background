import vscode from 'vscode';
import { VERSION } from './constants';

const welcome_msg = `Welcome to use background@${VERSION}! You can config it in \`settings.json\`.`;

const sudo_msg = "Oops! Failed to write to the file, we don't have permission to write to the file.";
const sudo_retry = 'Elevate permissions and retry';
const sudo_terminate = 'Terminate';

const restart_onchanged = 'Background has been changed! Please restart.';
const restart_onuninstalled = 'Background has been uninstalled! Please restart.';
const restart_onuninstalledExt = 'background extension has been uninstalled. See you next time!';

/**
 * 展示信息提示框
 *
 * @param {string} content 提示内容
 * @returns {Thenable<string>}
 */
// 无换行
// https://github.com/Microsoft/vscode/blob/8616dbae8bc2abf7972a45449b0fb6b2b2d0f429/src/vs/workbench/common/notifications.ts#L412-L413
const showInfo = (content: string): Thenable<string> => vscode.window.showInformationMessage(content);

/**
 * 提示信息并重启
 *
 * @param {string} content 提示内容
 * @returns {Thenable<void>}
 */
const showInfoRestart = (content: string): Thenable<void> =>
    vscode.window.showInformationMessage(content, { title: 'Restart vscode' }).then(function (item) {
        if (!item) return;
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    });

/**
 * 询问用户是否应该提权运行
 * @returns 是否应该提权运行
 */
export const sudo = () =>
    vscode.window.showErrorMessage(sudo_msg, sudo_retry, sudo_terminate).then(result => result === sudo_retry);

export const restartOnChanged = () => showInfoRestart(restart_onchanged);

export const restartOnUninstalled = () => showInfoRestart(restart_onuninstalled);
export const restartOnUninstalledExt = () => showInfoRestart(restart_onuninstalledExt);

export const welcome = () => showInfo(welcome_msg);
