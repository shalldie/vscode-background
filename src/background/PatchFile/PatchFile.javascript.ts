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
    public async applyPatches(patchContent: string) {
        let content = await this.getBackup();
        content += [
            //
            `\n// vscode-background-start ${BACKGROUND_VER}.${VERSION}`,
            patchContent,
            '// vscode-background-end'
        ].join('\n');

        await this.write(content);
    }
}
