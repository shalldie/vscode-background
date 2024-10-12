import uglifyjs from 'uglify-js';

import { utils } from '../../utils';
import { EditorPatchGenerator, EditorPatchGeneratorConfig } from './PatchGenerator.editor';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export type TPatchGeneratorConfig = {
    enabled: boolean;
    editor: EditorPatchGeneratorConfig;
    fullscreen: FullscreenPatchGeneratorConfig;
};

export class PatchGenerator {
    public static create(options: TPatchGeneratorConfig) {
        const script = [
            new EditorPatchGenerator(options.editor).create(), // editor
            new FullscreenPatchGenerator(options.fullscreen).create() // fullscreen
        ]
            .map(n => utils.withIIFE(n))
            .join(';');

        // return script;
        return uglifyjs.minify(script).code;
    }
}
