'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode, { MarkdownString, StatusBarAlignment, StatusBarItem } from 'vscode';
import { Background } from './background';
import { EXTENSION_ID, VERSION } from './constants';
import { vsHelp } from './utils/vsHelp';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export const statusbar: StatusBarItem = (() => {
    const item: StatusBarItem = vscode.window.createStatusBarItem(StatusBarAlignment.Right);

    item.command = 'extension.background.showAllCommands';
    item.name = 'Background';
    item.text = '$(file-media) Background';
    item.tooltip = new MarkdownString(['#### Background', 'Show all background commands.'].join('\n'));
    item.show();

    return item;
})();

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

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.install', async () => {
            await background.install(true); // 强制更新
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
                await vsHelp.showInfoRestart('Background extension has been uninstalled. See you next time!');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(statusbar.command as string, async () => {
            vscode.commands.executeCommand('workbench.action.quickOpen', '> background: ');
        })
    );
    context.subscriptions.push(statusbar);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    // vscode.window.showInformationMessage('deactivated!');
}
