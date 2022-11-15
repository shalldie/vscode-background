import { AbsCssGenerator, css } from './CssGenerator.base';
import { DefaultGeneratorOptions } from './CssGenerator.default';

export class RotatingGeneratorOptions {
    /**
     * 启用轮播
     */
    enabled = false;
    /**
     * 全屏幕轮播
     */
    fullscreen = false;
    duration = '60s';
}

type TrueRotatingGeneratorOptions = DefaultGeneratorOptions & RotatingGeneratorOptions;

export class RotatingCssGenerator extends AbsCssGenerator<TrueRotatingGeneratorOptions> {
    /**
     * 通过配置获取样式文本
     *
     * @protected
     * @param {object} options 用户配置
     * @param {boolean} useFront 是否前景图
     * @return {*}  {string}
     * @memberof DefaultCssGenerator
     */
    protected static getStyleByOptions(options: any, useFront: boolean, isFullScreen?: boolean): string {
        const styleArr: string[] = [];
        for (const k in options) {
            // 在使用before伪类背景图时，排除掉 pointer-events
            if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
                continue;
            }

            // 在使用全屏背景图时，排除掉 透明度
            if (isFullScreen && ~['opacity'].indexOf(k)) {
                continue;
            }

            // eslint-disable-next-line
            if (options.hasOwnProperty(k)) {
                styleArr.push(`${k}:${options[k]}`);
            }
        }
        return styleArr.join(';') + ';';
    }

    private static _getInterval(y: number): number {
        // y(x + 5) = 100
        // y 已知数 图片数量
        return (100 - 5 * y) / y;
    }

    /**
     * 获取编辑器范围内的背景图片轮播样式
     * @param options 扩展设置
     * @param images 图像数组
     * @param frames 帧数组
     * @param defStyle 默认样式
     * @returns CSS字符串
     */
    private static _getNormalCss = async (
        options: TrueRotatingGeneratorOptions,
        images: string[],
        frames: [number, number][],
        defStyle: string
    ) => {
        const keyframesMap = new Map<string, string>();
        const customstyles = new Array<string>();
        const selectors = new Array<string>();

        // ------ 在前景图时使用 ::after ------
        const frontContent = options.useFront ? 'after' : 'before';

        images.forEach((image, imageIndex) => {
            // ------ nth-child ------
            // nth-child(1)
            let nthChildIndex = imageIndex + 1 + '';
            // nth-child(3n + 1)
            if (options.loop) {
                nthChildIndex = `${images.length}n + ${nthChildIndex}`;
            }

            // ------ style ------
            const styleContent = defStyle + this.getStyleByOptions(options.styles[imageIndex] || {}, options.useFront);

            const _codeEditor = `#workbench\\.parts\\.editor .split-view-view:nth-child(${nthChildIndex}) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::${frontContent}`;
            const _emptyScreen = `#workbench\\.parts\\.editor .split-view-view:nth-child(${nthChildIndex}) .empty::${frontContent}`;
            selectors.push(`${_codeEditor},\n${_emptyScreen}`);
            customstyles.push(styleContent);

            const keyframesName = `vscode-background-images-${imageIndex}`;

            keyframesMap.set(
                keyframesName,
                css`
                    @keyframes ${keyframesName} {
                        ${frames.map(([start, end], frameIndex) => {
                            // 实际使用的图片应为 图片索引 + 帧索引
                            let trueIndex = imageIndex + frameIndex;
                            if (trueIndex >= images.length) {
                                // 当 真实索引 超出图片数组长度时从数组第一个重新计算
                                trueIndex = trueIndex - images.length;
                            }

                            return css`
                                ${start}%,
                                ${end}% {
                                    background-image: url('${images[trueIndex]}');
                                }
                            `;
                        })}
                        100%,
                        100% {
                            background-image: url('${images[imageIndex]}');
                        }
                    }
                `
            );
        });

        const keyframesNames = Array.from(keyframesMap.keys());

        return css`
            ${selectors.map((selector, index) => {
                const currentStyle = customstyles[index];
                const currentKeyFrames = keyframesNames[index];
                return css`
                    ${selector} {
                        animation: ${currentKeyFrames} ${options.duration} infinite linear;
                        ${currentStyle}
                    }
                `;
            })}
            #workbench\\.parts\\.editor .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background {
                background: none;
            }
            ${keyframesMap.values()}
        `;
    };

    private static _getFullscreenCss = async (
        options: TrueRotatingGeneratorOptions,
        images: string[],
        frames: [number, number][],
        defStyle: string
    ) => {
        // ------ 在前景图时使用 ::after ------
        const frontContent = options.useFront ? 'after' : 'before';

        // log: 当设置为after时背景可能不会生效，需要设置z-index大于0
        return css`
            body::${frontContent} {
                animation: vscode-background-images ${options.duration} infinite linear;
                ${defStyle}
                @keyframes vscode-background-images {
                    ${frames.map(
                        ([start, end], index) => css`
                            ${start}%, ${end}% {
                                background-image: url('${images[index]}');
                            }
                        `
                    )}
                    100%, 100% {
                        background-image: url('${images[0]}');
                    }
                }
            }
        `;
    };

    protected async getCss(options: TrueRotatingGeneratorOptions): Promise<string> {
        const interval = RotatingCssGenerator._getInterval(options.customImages.length);
        const images = await this.normalizeImages(options.customImages);
        const frames = new Array<[number, number]>();
        // ------ 默认样式 ------
        const defStyle = RotatingCssGenerator.getStyleByOptions(options.style, options.useFront, options.fullscreen);
        let current = 0;

        while (current < 100) {
            frames.push([current, current + interval]);
            current += interval;
            current += 5;
        }
        if (frames.length !== images.length) throw new Error('不可能抛出的异常');

        return await (options.fullscreen ? RotatingCssGenerator._getFullscreenCss : RotatingCssGenerator._getNormalCss)(
            options,
            images,
            frames,
            defStyle
        );
    }
}
