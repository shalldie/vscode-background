import * as stylis from 'stylis';
import vscode from 'vscode';

import { BACKGROUND_VER, VERSION } from '../../constants';

/**
 * 用于触发开发工具 css in js 语言支持
 *
 * @export
 * @param {TemplateStringsArray} template
 * @param {...any[]} args
 * @return {*}
 */
export function css(template: TemplateStringsArray, ...args: any[]) {
    return template.reduce((prev, curr, i) => {
        let arg = args[i];

        // 注意顺序, 内嵌函数可能返回 Array
        if (typeof arg === 'function') {
            arg = arg();
        }
        if (Array.isArray(arg)) {
            arg = arg.join('');
        }

        return prev + curr + (arg ?? '');
    }, '');
}

export abstract class AbsCssGenerator<T = any> {
    /**
     * 归一化图片路径
     * 在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
     * 当检测到配置文件使用 file 协议时, 需要将其转换为 vscode-file 协议
     * @protected
     * @param {string[]} images 图片列表
     * @return {*}
     * @memberof AbsCssGenerator
     */
    protected normalizeImageUrls(images: string[]) {
        return images.map(imageUrl => {
            if (!imageUrl.startsWith('file://')) {
                return imageUrl;
            }

            // file:///Users/foo/bar.png => vscode-file://vscode-app/Users/foo/bar.png
            const url = imageUrl.replace('file://', 'vscode-file://vscode-app');
            return vscode.Uri.parse(url).toString();
        });
    }

    /**
     * 创建轮播动画 keyframes
     *
     * @protected
     * @param {string[]} images 图片数组
     * @param {number} interval 切换间隔
     * @param {string} animationName 动画名称
     * @return {*}
     * @memberof AbsCssGenerator
     */
    protected createKeyFrames(images: string[], interval: number, animationName: string) {
        if (images.length <= 1 || interval < 1) {
            return '';
        }

        /**
         * 概设，假设2张图，
         * pd 为 perDuration，图片的渐变时长百分比
         *
         * ---
         *
         * 0%         , 50% - pd/2 {img0}
         * 50% + pd/2 , 100%       {img1}
         *
         * 需要3块frame，并进行偏移来保证效果连贯 =>
         *
         * 0%               ,  50% - pd - pd/2 {img0}
         * 50%  - pd + pd/2 , 100% - pd - pd/2 {img1}
         * 100% - pd        , 100%            {img0}
         *
         */

        const perDuration = 0.6 / (interval * images.length); // 渐变时间/动画总时长，渐变时间在总时长中占比
        const toPercent = (num: number) => (num * 100).toFixed(3) + '%';
        const perFrame = 1 / images.length; // 每片时长 eg: 0.5

        const frames = [...images, images[0]].map((url, index) => {
            let from = index * perFrame - perDuration + perDuration / 2;
            let to = (index + 1) * perFrame - perDuration - perDuration / 2;

            from = Math.max(from, 0);
            to = Math.min(to, 1);

            return {
                from: toPercent(from),
                to: toPercent(to),
                url
            };
        });

        return css`
            @keyframes ${animationName} {
                ${frames.map(({ from, to, url }) => {
                    return css`
                        ${from}, ${to} {
                            background-image: url('${url}');
                        }
                    `;
                })}
            }
        `;
    }

    /**
     * 编译 css
     *
     * @private
     * @param {string} source
     * @return {*}
     * @memberof AbsCssGenerator
     */
    private compileCSS(source: string) {
        return stylis.serialize(stylis.compile(source), stylis.stringify);
    }

    protected abstract getCss(options: T): Promise<string>;

    public async create(options: T) {
        const source = await this.getCss(options);
        const styles = this.compileCSS(source);

        if (process.env.NODE_ENV === 'development') {
            console.log(styles);
        }

        return `
        /*css-background-start*/
        /*${BACKGROUND_VER}.${VERSION}*/
        ${styles}
        /*css-background-end*/
        `;
    }
}
