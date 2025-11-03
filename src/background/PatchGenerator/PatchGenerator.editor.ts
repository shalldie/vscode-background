import { AbsPatchGenerator, css } from './PatchGenerator.base';

export class LegacyEditorPatchGeneratorConfig {
    useFront = true;
    style: Record<string, string> = {};
    styles: Array<Record<string, string>> = [];
    customImages: string[] = [];
    interval = 0;
}

export class EditorPatchGeneratorConfig {
    useFront = true;
    style: Record<string, string> = {};
    styles: Array<Record<string, string>> = [];
    images: string[] = [];
    folders: string[] = [];
    interval = 0;
    random = false;
}

export class EditorPatchGenerator extends AbsPatchGenerator<EditorPatchGeneratorConfig> {
    /**
     * 兼容旧版本配置
     *
     * @static
     * @param {LegacyEditorPatchGeneratorConfig} legacy
     * @param {EditorPatchGeneratorConfig} config
     * @return {*}  {EditorPatchGeneratorConfig}
     * @memberof EditorPatchGenerator
     */
    public static mergeLegacyConfig(
        legacy: LegacyEditorPatchGeneratorConfig,
        config: EditorPatchGeneratorConfig
    ): EditorPatchGeneratorConfig {
        // 没有v1配置，或者配置了v2配置。直接使用v2
        // 插件原地更新（vsix）的时候，config 可能找不到。
        if (!legacy?.customImages.length || config?.images.length) {
            return config;
        }

        // 反之，把v1配置按照v2格式返回
        return {
            ...legacy,
            images: legacy.customImages,
            folders: [],
            random: false
        };
    }

    /**
     * 用于每张图片独立样式的占位符前缀， template.replace(placeholder, dynamicStyle) => style
     *
     * @private
     * @memberof EditorPatchGenerator
     */
    private readonly cssplaceholder = '--background-editor-placeholder';

    private get curConfig() {
        // 默认值实际在 package.json 中定义，会 deep merge
        return {
            ...new EditorPatchGeneratorConfig(),
            ...this.config
        };
    }

    private getStyleByOptions(style: Record<string, string>, useFront: boolean): string {
        // 在使用背景图时，排除掉 pointer-events 和 z-index
        const excludeKeys = useFront ? [] : ['pointer-events', 'z-index'];

        return Object.entries(style)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([key, value]) => `${key}: ${value};`)
            .join('');
    }

    private get imageStyles() {
        const { images, style, styles, useFront } = this.curConfig;

        return images.map((img, index) => {
            return this.getStyleByOptions(
                {
                    ...style,
                    ...styles[index],
                    'background-image': `url(${img})`
                },
                useFront
            );
        });
    }

    private get styleTemplate() {
        const { images, useFront } = this.curConfig;

        // ------ 在前景图时使用 ::after ------
        const frontContent = useFront ? 'after' : 'before';

        // ------ 生成样式 ------
        return this.compileCSS(css`
            /* minimap */
            .minimap {
                opacity: 0.8;
            }

            [id='workbench.parts.editor'] .split-view-view {
                /* 处理一块背景色遮挡 */
                .editor-container .overflow-guard > .monaco-scrollable-element > .monaco-editor-background {
                    background: none;
                }
                /* 背景图片样式 */
                ${images.map((_img, index) => {
                    const nthChild = `${images.length}n + ${index + 1}`;

                    return css`
                        /* code editor */
                        &:nth-child(${nthChild}) .editor-instance>.monaco-editor .overflow-guard > .monaco-scrollable-element::${frontContent},
                        /* home screen */
                        &:nth-child(${nthChild}) .editor-group-container.empty::before {
                            content: '';
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            z-index: ${useFront ? 99 : 'initial'};
                            pointer-events: ${useFront ? 'none' : 'initial'};
                            transition: 0.3s;
                            background-repeat: no-repeat;
                            /* placeholder，用于动态替换css */
                            ${this.cssplaceholder + (index % images.length)}: #000;
                            ${this.cssplaceholder + '-end'}: #000;
                        }
                    `;
                })}
            }
        `);
    }

    protected getScript(): string {
        const { interval, random } = this.curConfig;
        return `
// options
const styleTemplate = ${JSON.stringify(this.styleTemplate)};
const cssplaceholder = '${this.cssplaceholder}';
const imageStyles = ${JSON.stringify(this.imageStyles)};
const interval = ${interval};
const random = ${random};

// variables
let curIndex = -1;

const style = (() => {
    const ele = document.createElement('style');
    document.head.appendChild(ele);
    return ele;
})();

function getNextStyles() {
    // 如果随机，乱序后返回
    if (random) {
        return imageStyles.slice().sort(() => Math.random() - 0.5);
    }

    // 其它按照自增索引返回
    curIndex++;
    curIndex = curIndex % imageStyles.length;
    return imageStyles.map((_s, index) => {
        const sIndex = (curIndex + index) % imageStyles.length;
        return imageStyles[sIndex];
    });
}

// replace placeholders with nextStyles in styleTemplate
function setNextStyles() {
    let curStyle = styleTemplate;
    const nextStyles = getNextStyles();
    for (let i = 0; i < nextStyles.length; i++) {
        const reg = new RegExp(cssplaceholder + i + '[^;]+;', 'g');
        curStyle = curStyle.replace(reg, nextStyles[i]);
    }
    style.textContent = curStyle;
}

if (interval > 0) {
    setInterval(setNextStyles, interval * 1000);
}

setNextStyles();
`;
    }
}
