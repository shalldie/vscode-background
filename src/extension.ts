// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';

import { Background } from './background';
import { EXTENSION_ID } from './constants';
import { vsHelp } from './utils/vsHelp';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getStatusbar() {
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);

    item.command = 'extension.background.showAllCommands';
    item.name = 'Background';
    item.text = '$(file-media) Background';
    item.tooltip = new vscode.MarkdownString(['#### Background', 'Show all background commands.'].join('\n'));
    item.show();

    return item;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const background = new Background();

    context.subscriptions.push(background);
    const ok = await background.setup();
    if (ok === false) {
        return;
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.info', function () {
            background.showWelcome();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.install', async () => {
            await background.config.update('enabled', true, true);
            await background.applyPatch();
            await vscode.commands.executeCommand('workbench.action.reloadWindow');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.disable', async () => {
            await background.config.update('enabled', false, true);
            await background.uninstall();
            await vscode.commands.executeCommand('workbench.action.reloadWindow');
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

    const statusbar = getStatusbar();
    context.subscriptions.push(
        vscode.commands.registerCommand(statusbar.command as string, async () => {
            vscode.commands.executeCommand('workbench.action.quickOpen', '> background: ');
        })
    );
    context.subscriptions.push(statusbar);
}

// this method is called when your extension is deactivated
export function deactivate(): void {}
