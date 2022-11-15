import { AbsCssGenerator } from './CssGenerator.base';
import { DefaultGeneratorOptions } from './CssGenerator.default';

export class RotatingGeneratorOptions {
    /**
     * 启用轮播
     */
    enabled = false;
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
    protected getStyleByOptions(options: object, useFront: boolean): string {
        const styleArr: string[] = [];
        for (const k in options) {
            // 在使用背景图时，排除掉 pointer-events
            if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
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

    protected async getCss(options: TrueRotatingGeneratorOptions): Promise<string> {
        const interval = RotatingCssGenerator._getInterval(options.customImages.length);
        const images = await this.normalizeImages(options.customImages);
        const frames = new Array<[number, number]>();
        let current = 0;

        while (current < 100) {
            frames.push([current, current + interval]);
            current += interval;
            current += 5;
        }
        if (frames.length !== images.length) throw new Error('不可能抛出的异常');

        let keyframes = '@keyframes vscode-background-images{';
        frames.forEach(([start, end], index) => {
            keyframes += `${start}%,${end}%{background-image: url('${images[index]}');}`;
        });
        keyframes += `100%,100%{background-image: url('${images[0]}');}`;
        keyframes += '}';

        // ------ 默认样式 ------
        const defStyle = this.getStyleByOptions(options.style, options.useFront);

        // ------ 在前景图时使用 ::after ------
        const frontContent = options.useFront ? '::after' : '::before';

        return (
            // code editor
            `[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element${frontContent},\n` +
            // home screen
            `[id="workbench.parts.editor"] .split-view-view .empty::before\n` +
            `{animation: vscode-background-images ${options.duration} infinite linear;${defStyle}}\n` +
            // 处理一块背景色遮挡
            '[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}\n' +
            keyframes
        );
    }
}
