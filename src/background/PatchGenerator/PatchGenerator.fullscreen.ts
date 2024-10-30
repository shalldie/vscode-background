import { AbsPatchGenerator, css } from './PatchGenerator.base';

export class FullscreenPatchGeneratorConfig {
    images = [] as string[];
    opacity = 0.2; // 建议在 0.1 ~ 0.3
    size = 'cover' as 'cover' | 'contain';
    position = 'center';
    interval = 0;
    random = false;
}

export class FullscreenPatchGenerator<T extends FullscreenPatchGeneratorConfig> extends AbsPatchGenerator<T> {
    protected cssvariable = '--background-fullscreen-img';

    protected get curConfig(): T {
        const cur = {
            ...new FullscreenPatchGeneratorConfig(),
            ...this.config
        };
        // ------ 处理图片 ------
        cur.images = this.normalizeImageUrls(cur.images);
        // ------ opacity ------
        if (cur.opacity < 0 || cur.opacity > 0.6) {
            cur.opacity = new FullscreenPatchGeneratorConfig().opacity;
        }

        return cur;
    }

    protected getStyle(): string {
        const { size, position, opacity } = this.curConfig;

        return css`
            body::after {
                content: '';
                display: block;
                position: absolute;
                z-index: 10;
                inset: 0;
                pointer-events: none;
                background-size: ${size};
                background-repeat: no-repeat;
                /* background-attachment: fixed; // 兼容 code-server，其他的不影响 */
                background-position: ${position};
                opacity: ${opacity};
                transition: 0.3s;
                background-image: var(${this.cssvariable});
            }
        `;
    }

    protected getScript(): string {
        const { images, random, interval } = this.curConfig;
        return `
const cssvariable = '${this.cssvariable}';
const images = ${JSON.stringify(images)};
const random = ${random};
const interval = ${interval};

let curIndex = -1;

function getNextImg() {
    if (random) {
        return images[Math.floor(Math.random() * images.length)];
    }

    curIndex++;
    curIndex = curIndex % images.length;
    return images[curIndex];
}

function setNextImg() {
    document.body.style.setProperty(cssvariable, 'url(' + getNextImg() + ')');
}

if (interval > 0) {
    setInterval(setNextImg, interval * 1000);
}

setNextImg();
        `;
    }
}
