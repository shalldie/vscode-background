import vscode, { l10n } from 'vscode';

class ReloadOptions {
    /** reload 提示内容 */
    message = '';
    /** reload 按钮文案 */
    btnReload = l10n.t('Reload vscode');
    /** reload 前置动作 */
    beforeReload?: () => any;
}

export const vsHelp = {
    /**
     * 重新加载 vscode
     *
     * @param {Partial<ReloadOptions>} [options={}] 定义重新加载的相关配置
     * @return {*}  {Promise<void>}
     */
    async reload(options: Partial<ReloadOptions> = {}): Promise<void> {
        // 填充默认值
        options = {
            ...new ReloadOptions(),
            ...options
        };
        // 如果需要确认
        if (options.message) {
            const goon = await vscode.window.showInformationMessage(options.message, { title: options.btnReload! });
            // 关闭了 提示框
            if (!goon) {
                return Promise.resolve();
            }
            // 关闭前置动作
            await options.beforeReload?.();
        }
        return vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
};
