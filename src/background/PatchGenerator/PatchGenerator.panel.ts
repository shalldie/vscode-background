import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class PanelPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class PanelPatchGenerator extends FullscreenPatchGenerator<PanelPatchGeneratorConfig> {
    protected selector = '.split-view-view > .part.panel::after';
}
