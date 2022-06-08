import vscode from 'vscode';

export const vsHelp = {
    /**
     * 展示信息提示框
     *
     * @param {string} content 提示内容
     * @returns {Thenable<string>}
     */
    showInfo(content: string): Thenable<string> {
        return vscode.window.showInformationMessage(content);
    },

    /**
     * 提示信息并重启
     *
     * @param {string} content 提示内容
     * @returns {Thenable<void>}
     */
    async showInfoRestart(content: string): Promise<void> {
        const fixChecksums = vscode.extensions.getExtension('lehni.vscode-fix-checksums');
        if (fixChecksums) {
            const result = await vscode.window.showInformationMessage(
                "We found the 'Fix VSCode Checksums' Extension has been installed. " +
                    'Do you want to use it to remove [unsupported] tag? ',
                'Yes',
                'No'
            );
            if (result === 'Yes') {
                vscode.commands.executeCommand('fixChecksums.apply');
                return;
            }
        }
        return vscode.window.showInformationMessage(content, { title: 'Restart vscode' }).then(function (item) {
            if (!item) return;
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    }
};
