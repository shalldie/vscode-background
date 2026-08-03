import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import vscode, { l10n, Uri } from 'vscode';

import { ENCODING } from './constants';

class ReloadOptions {
    /** reload 提示内容 */
    message = '';
    /** reload 按钮文案 */
    btnReload = l10n.t('Reload vscode');
    /** reload 前置动作，返回 false 可中断重启 */
    beforeReload?: () => Promise<boolean | void>;
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
            // 关闭前置动作，若显式返回 false（如 patch 写入失败）则中断，不重启，保留错误提示
            const shouldReload = await options.beforeReload?.();
            if (shouldReload === false) {
                return;
            }
        }
        return vscode.commands.executeCommand('workbench.action.reloadWindow');
    },

    async showMarkdown(content: string, key = 'temp') {
        const targetPath = path.join(tmpdir(), `${key}-background.md`);
        await fs.promises.writeFile(targetPath, content, ENCODING);
        return vscode.commands.executeCommand('markdown.showPreviewToSide', Uri.file(targetPath));
    }
};
