import { css } from './PatchGenerator.base';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';
import { ThemePatchGenerator } from './PatchGenerator.theme';

export class AuxiliarybarPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class AuxiliarybarPatchGenerator extends FullscreenPatchGenerator<AuxiliarybarPatchGeneratorConfig> {
    protected cssvariable = '--background-auxiliarybar-img';

    protected getStyle(): string {
        const { size, position, opacity } = this.curConfig;

        return css`
            .split-view-view > .part.auxiliarybar::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-position: ${position};
                background-repeat: no-repeat;
                background-size: ${size};
                pointer-events: none;
                opacity: ${opacity};
                transition: 1s;
                mix-blend-mode: var(${ThemePatchGenerator.cssMixBlendMode});
                background-image: var(${this.cssvariable});
            }
        `;
    }
}
