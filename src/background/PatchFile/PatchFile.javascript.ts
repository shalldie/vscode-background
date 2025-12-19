import { BACKGROUND_VER, VERSION } from '../../utils/constants';
import { AbsPatchFile } from './PatchFile.base';

// vscode-background-start background.ver.2.0.0
// vscode-background-end

/**
 * js 文件相关操作
 *
 * @export
 * @class JsPatchFile
 * @extends {AbsPatchFile}
 */
export class JsPatchFile extends AbsPatchFile {
    public async applyPatches(patchContent: string): Promise<boolean> {
        try {
            const curContent = await this.getContent();
            let content = this.cleanPatches(curContent);
            content += [
                //
                `\n// vscode-background-start ${BACKGROUND_VER}.${VERSION}`,
                patchContent,
                '// vscode-background-end'
            ].join('\n');

            // file unchanged
            if (curContent === content) {
                return true;
            }

            return await this.write(content);
        } catch {
            return false;
        }
    }

    protected cleanPatches(content: string): string {
        content = content.replace(/\n\/\/ vscode-background-start[\s\S]*\/\/ vscode-background-end/, '');
        return content;
    }
}
