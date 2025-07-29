import uglifyjs from 'uglify-js';

import { _ } from '../../utils';
import { AuxiliarybarPatchGenerator, AuxiliarybarPatchGeneratorConfig } from './PatchGenerator.auxiliarybar';
import { ChecksumsPatchGenerator } from './PatchGenerator.checksums';
import {
    EditorPatchGenerator,
    EditorPatchGeneratorConfig,
    LegacyEditorPatchGeneratorConfig
} from './PatchGenerator.editor';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';
import { PanelPatchGenerator, PanelPatchGeneratorConfig } from './PatchGenerator.panel';
import { SidebarPatchGenerator, SidebarPatchGeneratorConfig } from './PatchGenerator.sidebar';

export type TPatchGeneratorConfig = {
    enabled: boolean;
    editor: EditorPatchGeneratorConfig;
    sidebar: SidebarPatchGeneratorConfig;
    auxiliarybar: AuxiliarybarPatchGeneratorConfig;
    panel: PanelPatchGeneratorConfig;
    fullscreen: FullscreenPatchGeneratorConfig;
} & LegacyEditorPatchGeneratorConfig;

export class PatchGenerator {
    public static create(options: TPatchGeneratorConfig) {
        const script = [
            new ChecksumsPatchGenerator().create(), // fix checksums
            new EditorPatchGenerator(EditorPatchGenerator.mergeLegacyConfig(options, options.editor)).create(), // editor,
            new SidebarPatchGenerator(options.sidebar).create(), // sidebar
            new AuxiliarybarPatchGenerator(options.auxiliarybar).create(), // auxiliarybar
            new PanelPatchGenerator(options.panel).create(), // panel
            new FullscreenPatchGenerator(options.fullscreen).create() // fullscreen
        ]
            .map(n => _.withIIFE(n))
            .join(';');

        // return script;
        return uglifyjs.minify(script).code;
    }
}
