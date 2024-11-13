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
        let content = await this.getContent();
        content = this.cleanPatches(content);
        content += [
            //
            `\n// vscode-background-start ${BACKGROUND_VER}.${VERSION}`,
            patchContent,
            '// vscode-background-end'
        ].join('\n');

        return this.write(content);
    }

    protected cleanPatches(content: string): string {
        content = content.replace(/\n\/\/ vscode-background-start[\s\S]*\/\/ vscode-background-end/, '');
        return content;
    }
}
