import vscode, { l10n } from 'vscode';

export const vsHelp = {
    /**
     * 提示信息并重启
     *
     * @param {string} content 提示内容
     * @returns {Thenable<void>}
     */
    showInfoRestart(content: string): Thenable<void> {
        return vscode.window.showInformationMessage(content, { title: l10n.t('Restart vscode') }).then(function (item) {
            if (!item) return;
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    }
};
