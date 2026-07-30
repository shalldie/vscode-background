import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class AuxiliarybarPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class AuxiliarybarPatchGenerator extends FullscreenPatchGenerator<AuxiliarybarPatchGeneratorConfig> {
    protected selector = '.split-view-view > .part.auxiliarybar::after';
}
