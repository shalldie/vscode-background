import { AbsPatchGenerator, css } from './PatchGenerator.base';

export class FullscreenPatchGeneratorConfig {
    images = [] as string[];
    opacity = 0.91; // 建议在 0.85 ~ 0.95 之间微调
    size = 'cover' as 'cover' | 'contain';
    position = 'center';
    interval = 0;
    random = false;
}

export class FullscreenPatchGenerator extends AbsPatchGenerator<FullscreenPatchGeneratorConfig> {
    private readonly cssvariable = '--background-fullscreen-img';

    private get curConfig() {
        const cur = {
            ...new FullscreenPatchGeneratorConfig(),
            ...this.config
        };
        // ------ 处理图片 ------
        cur.images = this.normalizeImageUrls(cur.images);
        return cur;
    }

    protected getStyle(): string {
        const { size, position, opacity, images, interval } = this.curConfig;

        return css`
            body {
                background-size: ${size};
                background-repeat: no-repeat;
                background-attachment: fixed; // 兼容 code-server，其他的不影响
                background-position: ${position};
                opacity: ${opacity};
                transition: 0.3s;
            }
            // 从 1.78.0 开始使用 Chromium:108+，支持 :has 选择器
            body:has([id='workbench.parts.editor']) {
                background-image: var(${this.cssvariable});
            }
        `;
    }

    protected getScript(): string {
        const { images, random, interval } = this.curConfig;
        return `
var cssvariable = '${this.cssvariable}';
var images = ${JSON.stringify(images)};
var random = ${random};
var interval = ${interval};
var curIndex = -1;

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
