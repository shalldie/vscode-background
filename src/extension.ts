'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';
import { Background } from './background';
import { EXTENSION_ID, VERSION } from './constants';
import { vsHelp } from './utils/vsHelp';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "background" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.background.info', function () {
        // 无换行
        // https://github.com/Microsoft/vscode/blob/8616dbae8bc2abf7972a45449b0fb6b2b2d0f429/src/vs/workbench/common/notifications.ts#L412-L413
        vsHelp.showInfo(
            [
                //
                `Welcome to use background@${VERSION}!`,
                'You can config it in `settings.json`.'
            ].join(' ')
        );
    });

    context.subscriptions.push(disposable);

    const background = new Background();
    await background.setup();
    context.subscriptions.push(background);

    // 订阅主题模式的变更 dark <=> light
    context.subscriptions.push(
        vscode.window.onDidChangeActiveColorTheme(async () => {
            // TODO: debounce
            await background.refresh();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.uninstall', async () => {
            if (!(await background.hasInstalled())) {
                return;
            }

            if (await background.uninstall()) {
                // 当且仅当成功删除样式时才会卸载扩展
                // 否则可能导致没有成功删掉样式时扩展就被卸载掉
                await vscode.commands.executeCommand('workbench.extensions.uninstallExtension', EXTENSION_ID);
                await vsHelp.showInfoRestart('background extension has been uninstalled. See you next time!');
            }
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    // vscode.window.showInformationMessage('deactivated!');
}
