import { BACKGROUND_VER, VERSION } from '../../utils/constants';
import { AbsPatchFile } from './PatchFile.base';

export class HtmlPatchFile extends AbsPatchFile {
    public async applyPatches(patchContent: string): Promise<boolean> {
        try {
            const curContent = await this.getContent();
            let content = this.cleanPatches(curContent);

            // workbench.html 的 CSP 默认不含 'unsafe-inline'，内联 script 会被拦截，需主动注入
            content = content.replace(/(script-src)/, `$1 'unsafe-inline'`);

            // 将 patch 脚本内联到 HTML
            content = content.replace(
                '</html>',
                [
                    `<!-- vscode-background-start ${BACKGROUND_VER}.${VERSION} -->`,
                    `<script>${patchContent}</script>`,
                    '<!-- vscode-background-end -->',
                    '</html>'
                ].join('\n')
            );

            if (curContent === content) {
                return true;
            }

            return await this.write(content);
        } catch {
            return false;
        }
    }

    protected cleanPatches(content: string): string {
        // 精确逆向匹配，只移除注入的那个 'unsafe-inline'
        content = content.replace(/(script-src) 'unsafe-inline'/, '$1');
        // 清除内联 script 块
        content = content.replace(
            //
            /<!-- vscode-background-start[\s\S]*?<!-- vscode-background-end -->\n?/g,
            ''
        );
        return content;
    }
}
