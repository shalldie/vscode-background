import { css } from './PatchGenerator.base';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class PanelPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {
    opacity = 0.2; // 建议在 0.1~0.3 左右
}

export class PanelPatchGenerator extends FullscreenPatchGenerator {
    protected readonly cssvariable = '--background-panel-img';

    protected get curConfig() {
        const cur = {
            ...new PanelPatchGeneratorConfig(),
            ...this.config
        };
        // ------ 处理图片 ------
        cur.images = this.normalizeImageUrls(cur.images);
        return cur;
    }

    protected getStyle(): string {
        const { size, position, opacity } = this.curConfig;

        return css`
            .split-view-view > .part.panel::after {
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
                transition: 0.3s;
                background-image: var(${this.cssvariable});
            }
        `;
    }
}
