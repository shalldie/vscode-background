import * as vscode from 'vscode';

const vsHelp = {
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
     * @param {any} content 提示内容
     * @returns {Thenable<void>} 
     */
    showInfoRestart(content): Thenable<void> {
        return vscode.window.showInformationMessage(content, { title: "Restart vscode" })
            .then(function (item) {
                if (!item) return;
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            });
    }
}

export default vsHelp;