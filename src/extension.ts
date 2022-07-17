'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';
import { background } from './background';
import { vsHelp } from './vsHelp';

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
        vsHelp.showInfo('You can config your background in settings.json. Enjoy it!');
    });

    context.subscriptions.push(disposable);

    await background.setup();
    context.subscriptions.push(background);

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.uninstall', async () => {
            if (!(await background.hasInstalled())) {
                return;
            }

            const msg = 'background extension has been uninstalled. See You Next Time! ';
            if (await background.uninstall()) {
                // 当且仅当成功删除样式时才会卸载扩展
                // 否则可能导致没有成功删掉样式时扩展就被卸载掉
                await vscode.commands.executeCommand('workbench.extensions.uninstallExtension', 'shalldie.background');
                await vsHelp.showInfoRestart(msg);
            }
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    // vscode.window.showInformationMessage('deactivated!');
}
