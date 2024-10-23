import * as stylis from 'stylis';
import vscode from 'vscode';

import { utils } from '../../utils';

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

export class AbsPatchGenerator<T extends { images: string[] }> {
    constructor(protected config: T) {}

    /**
     * 归一化图片路径
     * 在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
     * 当检测到配置文件使用 file 协议时, 需要将其转换为 vscode-file 协议
     * @protected
     * @param {string[]} images 图片列表
     * @return {*}
     * @memberof AbsPatchGenerator
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
     * 编译 css
     *
     * @protected
     * @param {string} source
     * @return {*}
     * @memberof AbsPatchGenerator
     */
    protected compileCSS(source: string) {
        return stylis.serialize(stylis.compile(source), stylis.stringify);
    }

    protected getStyle() {
        return '';
    }

    protected getScript() {
        return '';
    }

    public create() {
        if (!this.config?.images.length) {
            return '';
        }

        const style = this.compileCSS(this.getStyle());
        const script = this.getScript().trim();

        return [
            `
                var style = document.createElement("style");
                style.textContent = ${JSON.stringify(style)};
                document.head.appendChild(style);
            `,
            script
        ]
            .map(n => utils.withIIFE(n))
            .join(';');
    }
}
