import vscode from 'vscode';
import { AbsCssGenerator, css } from './CssGenerator.base';

// 从 1.78.0 开始使用 Chromium:108+，支持 :has 选择器
const BODY_SELECTOR = parseFloat(vscode.version) >= 1.78 ? `body:has([id='workbench.parts.editor'])` : 'body';

/**
 * 全屏配置
 *
 * @export
 * @class FullScreenGeneratorOptions
 */
export class FullScreenGeneratorOptions {
    /**
     * 图片
     * @deprecated
     * @memberof FullScreenGeneratorOptions
     */
    image = '' as string | string[];
    /**
     * 图片
     * @memberof FullScreenGeneratorOptions
     */
    images = [] as string[];
    opacity = 0.91; // 建议在 0.85 ~ 0.95 之间微调
    size = 'cover' as 'cover' | 'contain';
    position = 'center';
    interval = 0;
}

/**
 * 全屏样式生成
 *
 * @export
 * @class FullScreenCssGenerator
 * @extends {AbsCssGenerator<FullScreenGeneratorOptions>}
 */
export class FullScreenCssGenerator extends AbsCssGenerator<FullScreenGeneratorOptions> {
    private getCarouselCss(images: string[], interval: number) {
        const animationName = 'background-fullscreen-carousel';
        const keyframeCSS = this.createKeyFrames(images, interval, animationName);

        if (!keyframeCSS) {
            return '';
        }

        return css`
            ${BODY_SELECTOR} {
                animation: ${animationName} ${images.length * interval}s infinite;
            }
            ${keyframeCSS}
        `;
    }

    protected async getCss(options: FullScreenGeneratorOptions) {
        const { size, position, opacity, image, images, interval } = {
            ...new FullScreenGeneratorOptions(),
            ...options
        };

        // ------ 处理图片 ------
        const allImages = images.slice();
        // 兼容下 image 字段
        if (Array.isArray(image)) {
            allImages.push(...image);
        }
        if (typeof image === 'string' && image.length) {
            allImages.push(image);
        }
        const nextImages = this.normalizeImageUrls(allImages);

        return css`
            ${BODY_SELECTOR} {
                background-size: ${size};
                background-repeat: no-repeat;
                background-attachment: fixed; // 兼容 code-server，其他的不影响
                background-position: ${position};
                opacity: ${opacity};
                background-image: url('${nextImages[0]}');
            }
            ${this.getCarouselCss(nextImages, interval)}
        `;
    }
}
