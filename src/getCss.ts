import defBase64 from './defBase64';
import { version, BACKGROUND_VER } from './constants';

/**
 * 通过配置获取样式文本
 *
 * @param {object} options 用户配置
 * @param {boolean} useFront 是否前景图
 * @returns {string}
 */
function getStyleByOptions(options: object, useFront: boolean): string {
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

/**
 * 生成样式项
 * @param n             nth-child的参数
 * @param url           图片url
 * @param useFront      是否使用前景图
 * @param otherStyle    追加的额外样式
 */
function genStyleItem(n: string, url: string, useFront: boolean, otherStyle: string): string {
    const frontContent = useFront ? '::after' : '::before';
    let selector = `[id="workbench.parts.editor"] .split-view-view:nth-child(${n}) .editor-container `;
    selector += `.editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element${frontContent}`;

    return `${selector} { background-image: url('${url}'); ${otherStyle} }`;
}

/**
 * 生成css样式
 *
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}] 自定义样式
 * @param {Array<any>} [styles=[]] 每个背景图的自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @param {boolean} [loop=false] 是否循环使用图片
 * @returns
 */
export default function (
    arr: Array<string>,
    style: any = {},
    styles: Array<any> = [],
    useFront = true,
    loop = false
): string {
    const defStyle = getStyleByOptions(style, useFront); // 默认样式
    let images = (arr && arr.length) ? arr : defBase64;
    let content = '\n/*css-background-start*/\n';

    // 追加版本号
    content += `/*${BACKGROUND_VER}.${version}*/\n`;

    if (!loop) {
        // 非循环使用生成nth-child(index + 1)
        images.forEach((item, index) => {
            const n = `${index + 1}`;
            const otherStyle = defStyle + getStyleByOptions(styles[index], useFront);
            content += genStyleItem(n, item, useFront, otherStyle) + '\n';
        });
    } else {
        // 循环使用逆序循环生成nth-child(length * n - index)
        images = images.reverse();
        const styleList = styles.reverse();
        const length = images.length;

        images.forEach((item, index) => {
            const n = `${length}n - ${index}`;
            const otherStyle = defStyle + getStyleByOptions(styleList[index], useFront);
            content += genStyleItem(n, item, useFront, otherStyle) + '\n';
        });
    }

    // 追加额外样式
    content += '[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}\n';

    // 追加结束标志
    content += '/*css-background-end*/\n';

    return content;
}
