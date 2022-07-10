import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';
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
 * 使用 file 协议加载图片文件并转为 base64
 * @param url 图片路径
 */
async function loadImageBase64FromFileProtocol(url: string): Promise<string> {
    const fileUrl = new URL(url);
    const buffer = await fs.readFile(fileUrl);
    const extName = path.extname(fileUrl.pathname).substring(1); // substr 已被标记弃用

    return `data:image/${extName};base64,${buffer.toString('base64')}`;
}

/**
 * 生成 css 内容
 *
 * @export
 * @param {string[]} images 图片数组
 * @param {*} [style={}] 自定义样式
 * @param {Array<any>} [styles=[]] 每个背景图的自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @param {boolean} [loop=false] 是否循环使用图片
 * @param {number} [minimapOpacity] miniMap的透明度
 * @returns {string}
 */
export async function getCss(
    images: string[],
    style: any = {},
    styles: Array<any> = [],
    useFront = true,
    loop = false,
    minimapOpacity?: number,
    backgroundSelectors?: string[],
    removeBackgroundSelectors?: string[]
): Promise<string> {
    // ------ 默认样式 ------
    const defStyle = getStyleByOptions(style, useFront);

    // ------ 在前景图时使用 ::after ------
    const frontContent = useFront ? '::after' : '::before';

    /*
      图片预处理
      在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
      当检测到配置文件使用 file 协议时, 需要将图片读取并转为 base64, 而后再插入到 css 中
    */

    const list = images.map(async url => {
        return url.startsWith('file://') ? await loadImageBase64FromFileProtocol(url) : url;
    });

    // Minimap 透明度样式
    const minimapStyleContent =
        !!minimapOpacity && minimapOpacity < 1
            ? `[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard .minimap{opacity: ${minimapOpacity};}`
            : '';

    // ------ 组合样式 ------
    const imageStyleContent = (
        await Promise.all(
            list.map((img, index, arr) =>
                makeImageStyleContent(img, index, arr, loop, frontContent, defStyle, styles, backgroundSelectors)
            )
        )
    ).join('\n');

    const removeBackground = clearBackground(
        // 自定义选择器
        ...removeBackgroundSelectors.map(i => i.trim())
    );

    const content = wrapCssContent(minimapStyleContent, imageStyleContent, removeBackground);

    return content;
}
const wrapCssContent = (...cssContent: string[]) => /* css */ `
/*css-background-start*/
/*${BACKGROUND_VER}.${version}*/
${cssContent.join('\n')}
/*css-background-end*/
`;

/**
 * 获取删除背景的CSS样式字符串
 * @param selectors 选择器
 * @returns 同步的CSS样式字符串
 */
const clearBackground = (...selectors: string[]) => {
    return selectors.map(i => i.trim()).join(',') + /* css */ `{background: none;}`;
};

/**
 * 获取背景图样式
 * @param img 图片路径
 * @param styleContent 图片的样式
 * @param selectors 选择器
 * @returns 异步的CSS样式字符串
 */
const setBackground = async (img: Promise<string>, styleContent: string, ...selectors: string[]) => {
    return selectors.map(i => i.trim()).join(',') + /* css */ `{background-image:url('${await img}');${styleContent}}`;
};

/**
 * 生成图片样式
 *
 * @param img 异步的图片uri
 * @param index 图片索引
 * @param images 异步图片uri 数组
 * @param loop 是否循环使用图片
 * @param frontContent 伪元素
 * @param defStyle 默认样式
 * @param styles 每个背景图的自定义样式
 * @param backgroundSelectors 自定义选择器
 * @returns {Promise<string>} 异步的css字符串
 */
const makeImageStyleContent = (
    img: Promise<string>,
    index: number,
    images: Promise<string>[],
    loop: boolean,
    frontContent: '::after' | '::before',
    defStyle: string,
    styles: any[],
    backgroundSelectors: string[]
): Promise<string> => {
    // ------ nth-child ------
    // nth-child(1)
    let nthChildIndex = index + 1 + '';
    // nth-child(3n + 1)
    if (loop) {
        nthChildIndex = `${images.length}n + ${nthChildIndex}`;
    }

    // ------ style ------
    const styleContent = defStyle + getStyleByOptions(styles[index] || {}, frontContent === '::after');

    return setBackground(
        img,
        styleContent,
        // 自定义选择器
        ...backgroundSelectors.map(str =>
            str.replace('${nthChildIndex}', nthChildIndex).replace('${frontContent}', frontContent).trim()
        )
    );
};
