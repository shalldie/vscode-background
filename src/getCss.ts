import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import path from 'path';

import type { VSCodeBackgroundConfig } from './bg-config';
import { BACKGROUND_VER, VERSION } from './constants';
import { defBase64 } from './defBase64';
import { Selector, selectors } from './selectors';

// see https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats/Image_types
const mimeTypes = {
    apng: 'image/apng',
    avif: 'image/avif',
    bmp: 'image/bmp',
    gif: 'image/gif',
    // 'image/vnd.microsoft.icon'
    ico: 'image/x-icon', // 应该不会有人指向一个...图标文件吧...?
    cur: 'image/x-icon', // 应该更加不会有人指向一个...光标文件吧...?
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    tif: 'image/tiff', // 这个图片格式不受Chrome支持
    tiff: 'image/tiff', // 这个图片格式不受Chrome支持
    webp: 'image/webp'
};

const toBase64 = async (uri: vscode.Uri) => {
    const buffer = await fs.readFile(uri.fsPath);
    const extName = path.extname(uri.fsPath).substring(1);
    const mime = mimeTypes[extName];

    if (mime === 'image/tiff') throw new Error('Cannot Support this file');

    return vscode.Uri.parse(`data:${mime};base64,${buffer.toString('base64')}`);
};

/**
 * 图片预处理
 * @param images 图片地址
 * @returns 图片Uri
 */
const getImageList = async (images: string[]) => {
    const list = new Array<vscode.Uri>(images.length);

    for (let index = 0; index < images.length; index++) {
        const path = images[index].trim();

        const uri =
            path.startsWith('file://') || path.startsWith('/') || path.startsWith(":'", 1)
                ? vscode.Uri.file(path.replace('file://', ''))
                : vscode.Uri.parse(path, true);

        if (uri.scheme != 'file') {
            // 它不是本地文件系统的文件
            list[index] = uri;
            continue;
        }

        list[index] = await toBase64(uri);
    }

    return list;
};

const getNthChildIndex = (index: number, loop: boolean, length: number) => {
    // ------ nth-child ------
    // nth-child(1)
    let nthChildIndex = `${index + 1}`;
    // nth-child(3n + 1)
    if (loop) {
        nthChildIndex = `${length}n + ${nthChildIndex}`;
    }
    return nthChildIndex;
};
/**
 * 通过配置获取样式文本
 *
 * @param {object | undefined} style 用户配置
 * @param {boolean} isFront 是否前景图
 * @returns {object}
 */
const parseStyle = (style: object | undefined, isFront: boolean): object => {
    if (!style) return {};

    // 将只读对象变成普通对象
    style = { ...style };

    // 在使用背景图时，排除掉 pointer-events
    if (!isFront) {
        if (style['pointer-events']) style['pointer-events'] = undefined;
        if (style['z-index']) style['z-index'] = undefined;
    }

    return style;
};
/**
 * 将对象转换成css样式
 * @param style 样式
 * @param backgroundUrl 背景图片URL
 * @returns CSS字符串
 */
const object2css = (style: object | undefined, backgroundUrl?: vscode.Uri) => {
    if (!style) return;

    let css = '';
    if (backgroundUrl) {
        css += `  background-image: url(${backgroundUrl.toString()});\n`;
    }
    for (const prop in style) {
        if (style[prop]) css += `  ${prop}: ${style[prop]};\n`;
    }
    return `{\n${css}}`;
};

/**
 * 从配置中取出选择器
 * @param config 配置
 * @returns 选择器
 */
const getAllSelectors = (config: VSCodeBackgroundConfig) => {
    const cssSelectors: Array<Selector> = [];
    for (const key in config.editors) {
        const element = config.editors[key];
        // when element is undefined | null | 0 | false
        if (!element) continue;

        cssSelectors.push(selectors[key](config.useFront));
    }
    return {
        target: (nth?: string) => [...new Set<string>(cssSelectors.map(selector => selector.target(nth)))],
        remove: [...new Set<string>(cssSelectors.flatMap(selector => selector.remove).filter(i => i))]
    };
};

/**
 * 生成 css 内容
 *
 * @export
 * @param config 扩展配置项
 * @return css字符串
 */
export const getCss = async (config: VSCodeBackgroundConfig) => {
    // 异步处理图像
    const tImages = getImageList(config.customImages);

    // 通用样式
    const commonStyle = parseStyle({ content: "''", ...config.style }, config.useFront);
    // 专用样式构建器
    const specialStyle = (index: number) => parseStyle(config.styles[index], config.useFront);

    // 从设置中取出将要应用背景的元素的选择器
    const cssSelectors = getAllSelectors(config);

    // 应用通用样式的选择器
    const commonCssSelectors = cssSelectors.target().join(',\n') + '\n' + object2css(commonStyle);
    // 应用清除背景样式的选择器
    const removeCssSelectors = cssSelectors.remove.join(',\n') + '\n' + object2css({ background: 'none' });
    // 应用专用样式的选择器
    const specialCssSelectors: Array<string> = [];

    // 取回异步结果
    const images = config.useDefault
        ? [...defBase64.map(uri => vscode.Uri.parse(uri, true)), ...(await tImages)]
        : await tImages;

    for (let index = 0; index < images.length; index++) {
        const nth = getNthChildIndex(index, config.loop, images.length);

        specialCssSelectors[index] =
            cssSelectors.target(nth).join(',\n') + '\n' + object2css(specialStyle(index), images[index]);
    }

    let other = '';
    // 垂直滚动条透明度
    if (config.opacities.decorationsOverviewRuler != 1)
        other += `.decorationsOverviewRuler\n{\n  opacity: ${config.opacities.decorationsOverviewRuler};\n}`;

    return /* css */ `
/*css-background-start*/
/*${BACKGROUND_VER}.${VERSION}*/
${commonCssSelectors}
${removeCssSelectors}
${specialCssSelectors.join('\n')}
${other}
/*css-background-end*/
`;
};
