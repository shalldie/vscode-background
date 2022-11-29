import { defBase64 } from '../../constants';
import { AbsCssGenerator, css } from './CssGenerator.base';

/**
 * 默认配置
 *
 * @export
 * @class DefaultGeneratorOptions
 */
export class DefaultGeneratorOptions {
    useFront = true;
    useDefault = true;
    style: any = {};
    styles: Array<any> = [];
    customImages: string[] = [];
    loop = false;
    interval = 0;
}

/**
 * 默认样式生成
 *
 * @export
 * @class DefaultCssGenerator
 * @extends {AbsCssGenerator<DefaultGeneratorOptions>}
 */
export class DefaultCssGenerator extends AbsCssGenerator<DefaultGeneratorOptions> {
    /**
     * 通过配置获取样式文本
     *
     * @private
     * @param {object} options 用户配置
     * @param {boolean} useFront 是否前景图
     * @return {*}  {string}
     * @memberof DefaultCssGenerator
     */
    private getStyleByOptions(options: any, useFront: boolean): string {
        // 在使用背景图时，排除掉 pointer-events 和 z-index
        const excludeKeys = useFront ? [] : ['pointer-events', 'z-index'];

        return Object.entries(options)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([key, value]) => `${key}: ${value};`)
            .join('');
    }

    /**
     * 生成轮播样式
     *
     * @private
     * @param {string[]} images 图片数组
     * @param {number} interval 切换间隔
     * @param {number} index 当前panel索引
     * @return {*}
     * @memberof DefaultCssGenerator
     */
    private getCarouselCss(images: string[], interval: number, index: number) {
        images = [...images.slice(index), ...images.slice(0, index)];

        const animationName = `background-default-carousel-${index}`;
        const keyframeCSS = this.createKeyFrames(images, interval, animationName);

        if (!keyframeCSS) {
            return '';
        }

        return css`
            animation: ${animationName} ${images.length * interval}s infinite;
            ${keyframeCSS}
        `;
    }

    protected async getCss(options: DefaultGeneratorOptions) {
        const { useDefault, customImages, style, styles, useFront, loop, interval } = {
            ...new DefaultGeneratorOptions(),
            ...options
        };

        // ------ 处理图片 ------
        const images = this.normalizeImageUrls(useDefault ? defBase64 : customImages);

        // ------ 默认样式 ------
        const defStyle = this.getStyleByOptions(style, useFront);

        // ------ 在前景图时使用 ::after ------
        const frontContent = useFront ? 'after' : 'before';

        // ------ 生成样式 ------
        return css`
            [id='workbench.parts.editor'] .split-view-view {
                // 处理一块背景色遮挡
                .editor-container .overflow-guard > .monaco-scrollable-element > .monaco-editor-background {
                    background: none;
                }
                // 背景图片样式
                ${images.map((image, index) => {
                    const styleContent = defStyle + this.getStyleByOptions(styles[index] || {}, useFront);
                    const nthChild = loop ? `${images.length}n + ${index + 1}` : `${index + 1}`;

                    return css`
                        /* code editor */
                        &:nth-child(${nthChild}) .editor-container .overflow-guard > .monaco-scrollable-element::${frontContent},
                        /* home screen */
                        &:nth-child(${nthChild}) .empty::before {
                            background-image: url('${image}');
                            ${styleContent}
                            ${this.getCarouselCss(images, interval, index)}
                        }
                    `;
                })}
            }
        `;
    }
}
