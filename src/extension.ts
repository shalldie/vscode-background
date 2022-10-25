import vscode from 'vscode';
import * as background from './background';
import { uninstallExtension } from './uninstall_cmd';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const firstload = background.checkFirstload(); // 是否初次加载插件

    const fileType = await background.getCssContent().then(background.getFileType); // css 文件目前状态

    // 如果是第一次加载插件，或者旧版本
    if (firstload || fileType != background.ECSSEditType.isNew) {
        await background.install(true);
    }

    // 监听文件改变
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => background.install()));
    // 注册卸载命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.background.uninstall', uninstallExtension));
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    // vscode.window.showInformationMessage('deactivated!');
}
