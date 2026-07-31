import { AbsPatchGenerator, css } from './PatchGenerator.base';
import { ThemePatchGenerator } from './PatchGenerator.theme';

export class FullscreenPatchGeneratorConfig {
    images = [] as string[];
    opacity = 0.1; // 建议在 0.1 ~ 0.3
    size = 'cover' as 'cover' | 'contain';
    position = 'center';
    styles: Array<Record<string, string>> = [];
    interval = 0;
    random = false;
}

export class FullscreenPatchGenerator<T extends FullscreenPatchGeneratorConfig> extends AbsPatchGenerator<T> {
    /** 背景图挂载的选择器，子类覆盖 */
    protected selector = 'body::after';

    protected get curConfig(): T {
        const cur = {
            ...new FullscreenPatchGeneratorConfig(),
            ...this.config
        };

        // ------ opacity ------
        if (cur.opacity < 0 || cur.opacity > 0.6) {
            cur.opacity = new FullscreenPatchGeneratorConfig().opacity;
        }

        return cur;
    }

    protected getStyle(): string {
        const { size, position, opacity } = this.curConfig;

        return css`
            ${this.selector} {
                content: '';
                display: block;
                position: absolute;
                inset: 0;
                z-index: 1000;
                pointer-events: none;
                background-size: ${size};
                background-repeat: no-repeat;
                background-position: ${position};
                opacity: ${opacity};
                transition: 1s;
                mix-blend-mode: var(${ThemePatchGenerator.cssMixBlendMode});
            }
        `;
    }

    /**
     * 为每张图片生成一条动态规则：自定义样式（可覆盖默认样式）+ background-image
     */
    private get imageRules() {
        const { images, styles } = this.curConfig;

        return images.map((img, index) => {
            const style = this.serializeStyle({
                ...styles[index],
                'background-image': `url(${img})`
            });

            return this.compileCSS(`${this.selector} { ${style} }`);
        });
    }

    protected getScript(): string {
        const { images, random, interval } = this.curConfig;
        if (!images.length) {
            return '';
        }
        return `
const imageRules = ${JSON.stringify(this.imageRules)};
const random = ${random};
const interval = ${interval};

let curIndex = -1;

const style = (() => {
    const ele = document.createElement('style');
    document.head.appendChild(ele);
    return ele;
})();

function getNextRule() {
    if (random) {
        return imageRules[Math.floor(Math.random() * imageRules.length)];
    }

    curIndex++;
    curIndex = curIndex % imageRules.length;
    return imageRules[curIndex];
}

function setNextRule() {
    style.textContent = getNextRule();
}

if (interval > 0) {
    setInterval(setNextRule, interval * 1000);
}

setNextRule();
        `;
    }
}
