import { AbsCssGenerator } from './CssGenerator.base';

export class DefaultGeneratorOptions {
    images: string[] = [];
    style: any = {};
    styles: Array<any> = [];
    useFront = true;
    loop = false;
}

export class DefaultCssGenerator extends AbsCssGenerator {
    protected async getCss(options: DefaultGeneratorOptions) {
        const { images, style, styles, useFront, loop } = options;

        // ------ 默认样式 ------
        const defStyle = this.getStyleByOptions(style, useFront);

        // ------ 在前景图时使用 ::after ------
        const frontContent = useFront ? '::after' : '::before';

        /*
          图片预处理
          在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
          当检测到配置文件使用 file 协议时, 需要将图片读取并转为 base64, 而后再插入到 css 中
        */

        const list = await this.normalizeImages(images);

        // ------ 组合样式 ------
        const imageStyleContent = list
            .map((img, index) => {
                // ------ nth-child ------
                // nth-child(1)
                let nthChildIndex = index + 1 + '';
                // nth-child(3n + 1)
                if (loop) {
                    nthChildIndex = `${images.length}n + ${nthChildIndex}`;
                }

                // ------ style ------
                const styleContent = defStyle + this.getStyleByOptions(styles[index] || {}, useFront);

                return (
                    // code editor
                    `[id="workbench.parts.editor"] .split-view-view:nth-child(${nthChildIndex}) ` +
                    `.editor-container .editor-instance>.monaco-editor ` +
                    `.overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img}');${styleContent}}` +
                    '\n' +
                    // home screen
                    `[id="workbench.parts.editor"] .split-view-view:nth-child(${nthChildIndex}) ` +
                    `.empty::before { background-image: url('${img}');${styleContent} }` +
                    '\n' +
                    // 处理一块背景色遮挡
                    '[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}'
                );
            })
            .join('\n');

        return imageStyleContent;
    }
}
