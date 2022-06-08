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
     * @param {string} contentWhenFixChecksumsBeInstalled 当'Fix VSCode Checksums'扩展被安装时的提示内容
     * @returns {Thenable<void>}
     */
    async showInfoRestart(
        content: string,
        contentWhenFixChecksumsBeInstalled = "We found the 'Fix VSCode Checksums' Extension has been installed. Do you want to use it to remove [unsupported] tag? "
    ): Promise<void> {
        const fix = 'use Fix VSCode Checksums';
        const restart = 'Restart vscode';
        const fixChecksums = vscode.extensions.getExtension('lehni.vscode-fix-checksums');

        const items: string[] = [];
        let msg = content;
        if (fixChecksums) {
            items.push(fix);
            msg = contentWhenFixChecksumsBeInstalled;
        }
        items.push(restart);

        vscode.window.showInformationMessage(msg, ...items).then(item => {
            switch (item) {
                case restart:
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                    break;
                case fix:
                    vscode.commands.executeCommand('fixChecksums.apply');
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                    break;
            }
        });
    }
};
