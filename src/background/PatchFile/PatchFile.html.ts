import path from 'path';

import { BACKGROUND_VER, VERSION } from '../../utils/constants';
import { AbsPatchFile } from './PatchFile.base';

const PATCH_SCRIPT_NAME = 'vscode-background.patch.js';

export class HtmlPatchFile extends AbsPatchFile {
    public async applyPatches(patchContent: string): Promise<boolean> {
        try {
            const written = await this.saveContentTo(
                path.join(path.dirname(this.filePath), PATCH_SCRIPT_NAME),
                patchContent
            );
            if (!written) {
                return false;
            }

            const curContent = await this.getContent();
            let content = this.cleanPatches(curContent);

            content = content.replace(
                '</html>',
                [
                    `<!-- vscode-background-start ${BACKGROUND_VER}.${VERSION} -->`,
                    `<script src="./${PATCH_SCRIPT_NAME}?v=${Date.now()}"></script>`,
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
        return content.replace(/<!-- vscode-background-start[\s\S]*?<!-- vscode-background-end -->\n?/g, '');
    }
}
