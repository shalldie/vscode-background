import { AbsPatchGenerator, css } from './PatchGenerator.base';
import { ThemePatchGenerator } from './PatchGenerator.theme';

/** fullscreen 透明度上限，覆盖层压在整个 workbench 之上，过高会遮住文字。与 package.json 中该配置项的 `maximum` 保持一致 */
export const FULLSCREEN_MAX_OPACITY = 0.6;

export class FullscreenPatchGeneratorConfig {
    images = [] as string[];
    opacity = 0.1; // 建议在 0.1 ~ 0.3，上限见 FULLSCREEN_MAX_OPACITY
    size = 'cover' as 'cover' | 'contain';
    position = 'center';
    styles: Array<Record<string, string>> = [];
    interval = 0;
    random = false;
}

/**
 * 把透明度钳制到 `0 ~ FULLSCREEN_MAX_OPACITY`，非数字回退到默认值
 * 不用 `Number()` 转换：`Number(null)`、`Number('')` 都是 0，会把图片变成全透明
 *
 * @export
 * @param {unknown} opacity
 * @return {*}  {number}
 */
export function clampFullscreenOpacity(opacity: unknown): number {
    if (typeof opacity !== 'number' || !Number.isFinite(opacity)) {
        return new FullscreenPatchGeneratorConfig().opacity;
    }
    return Math.min(Math.max(opacity, 0), FULLSCREEN_MAX_OPACITY);
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
        // 超出范围时钳制到边界，而不是静默重置为默认值（#636）
        cur.opacity = clampFullscreenOpacity(cur.opacity);

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
