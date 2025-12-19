import vscode, { l10n } from 'vscode';

// class ReloadOptions {
//     message = '';
//     btnReload = l10n.t('Reload vscode');
//     beforeReload?: () => void | Promise<void>;
// }

export const vsHelp = {
    // async reload(options: Partial<ReloadOptions> = {}): Promise<void> {
    //     // 填充默认值
    //     options = {
    //         ...new ReloadOptions(),
    //         ...options
    //     };
    //     // 如果需要确认
    //     if (options.message) {
    //         const goon = await vscode.window.showInformationMessage(options.message, { title: options.btnReload! });
    //         // 关闭了 提示框
    //         if (!goon) {
    //             return Promise.resolve();
    //         }

    //         if (options.beforeReload) {
    //             await options.beforeReload();
    //         }
    //     }
    //     return vscode.commands.executeCommand('workbench.action.reloadWindow');
    // },
    /**
     * 提示内容并重载
     *
     * @param {string} message 提示内容
     * @returns {Thenable<void>}
     */
    showInfoReload(message: string): Thenable<void> {
        return vscode.window.showInformationMessage(message, { title: l10n.t('Reload vscode') }).then(function (item) {
            if (!item) return;
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    }
};
