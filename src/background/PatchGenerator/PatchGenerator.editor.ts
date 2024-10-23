/**
 * FIXME:
 * 1. styles 目前还没有跟随 interval 一起变动
 * 2. 保持对v1的兼容
 * 3. 提供默认图片能力
 */

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
            random: false
        };
    }

    private readonly cssvariable = '--background-editor-img';

    private get curConfig() {
        // 默认值实际在 package.json 中定义，会 deep merge
        const cur: EditorPatchGeneratorConfig = {
            ...new EditorPatchGeneratorConfig(),
            ...this.config
        };
        // ------ 处理图片 ------
        cur.images = this.normalizeImageUrls(cur.images);
        return cur;
    }

    private getStyleByOptions(style: Record<string, string>, useFront: boolean): string {
        // 在使用背景图时，排除掉 pointer-events 和 z-index
        const excludeKeys = useFront ? [] : ['pointer-events', 'z-index'];

        return Object.entries(style)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([key, value]) => `${key}: ${value};`)
            .join('');
    }

    protected getStyle(): string {
        const { images, style, styles, useFront } = this.curConfig;

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
                ${images.map((_img, index) => {
                    const styleContent = defStyle + this.getStyleByOptions(styles[index] || {}, useFront);
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
                            background-image: var(${this.cssvariable + (index % images.length)});
                            background-repeat: no-repeat;
                            ${styleContent}
                        }
                    `;
                })}
            }
        `;
    }

    protected getScript(): string {
        const { images, interval, random } = this.curConfig;
        return `
var cssvariable = '${this.cssvariable}';
var images = ${JSON.stringify(images)};
var interval = ${interval};
var random = ${random};
var curIndex = -1;

function getNextImages() {
    if (random) {
        return images.slice().sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        });
    }

    curIndex++;
    curIndex = curIndex % images.length;

    return images.map(function (_img, index) {
        var imgIndex = curIndex + index;
        imgIndex = imgIndex % images.length;
        return images[imgIndex];
    });
}

function setNextImages() {
    const nextImages = getNextImages();
    for (var i = 0; i < images.length; i++) {
        document.body.style.setProperty(cssvariable + i, 'url(' + nextImages[i] + ')');
    }
}

if (interval > 0) {
    setInterval(setNextImages, interval * 1000);
}

setNextImages();
        `;
    }
}
