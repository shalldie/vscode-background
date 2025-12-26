import { pathToFileURL } from 'url';

import fg from 'fast-glob';
import * as stylis from 'stylis';
import vscode from 'vscode';

import { _ } from '../../utils';

/**
images 支持以下格式：

------ 网络图片 ------
https://...

------ 本地目录、图片 ------
file:///path/to/local/file
/home/xie/downloads/images
C:/Users/xie/downloads/images
D:\\downloads\\images
*/

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
    protected config: T;

    /** 必须有图片 */
    protected imageRequired = true;

    constructor(config: T) {
        const images = config?.images.filter(n => n.length) || [];
        this.config = {
            ...config,
            images: images.flatMap(img => {
                // ------ 网络图片，`https://` ------
                if (img.startsWith('http')) {
                    return [img];
                }
                // ------ 本地 ------
                // 文件，模糊判断。`.xxx`
                if (/\.[^\\/]+$/.test(img)) {
                    return this.normalizeImageUrls([img]);
                }
                // 文件夹
                return this.normalizeImageUrls(this.getImagesFromFolders([img]));
            })
        };
    }

    /**
     * 归一化图片路径
     * 在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
     * 将「绝对路径」、「file协议」,转换为「vscode-file协议」
     * @private
     * @param {string[]} [images=[]] 图片列表
     * @return {*}
     * @memberof AbsPatchGenerator
     */
    private normalizeImageUrls(images: string[] = []) {
        return images.map(imageUrl => {
            try {
                // 非 file协议（绝对路径），先转成 file协议。
                if (!imageUrl.startsWith('file://')) {
                    imageUrl = pathToFileURL(imageUrl).href;
                }

                // file协议 转 vscode-file协议
                // file:///Users/foo/bar.png => vscode-file://vscode-app/Users/foo/bar.png
                const url = imageUrl.replace('file://', 'vscode-file://vscode-app');
                return vscode.Uri.parse(url).toString();
            } catch {
                return '';
            }
        });
    }

    /**
     * 获取文件夹下的所有图片
     * 支持的类型：`'svg', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'otf', 'ttf'`
     * @private
     * @param {string[]} [folders=[]]
     * @return {*}
     * @memberof AbsPatchGenerator
     */
    private getImagesFromFolders(folders: string[] = []) {
        try {
            const types = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'otf', 'ttf'];
            return fg.sync(
                folders
                    // 处理win下的分隔符，去除末尾的/
                    .map(f => f.replace(/\\/g, '/').replace(/\/+$/, ''))
                    .map(f => `${f}/**/*.@(${types.join('|')})`),
                { onlyFiles: true, absolute: true, caseSensitiveMatch: false }
            );
        } catch {
            return [];
        }
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

    protected getPreload() {
        const images = this.config.images.filter(n => n.length);
        // 10个以内图片，做预加载进行优化
        if (!images.length || images.length > 10) {
            return '';
        }
        return `
const images = ${JSON.stringify(images)};

const container = (() => {
    const cid = 'backgroundPreloadContainer';
    let c = document.getElementById(cid);
    if (!c) {
        c = document.createElement('div');
        c.id = cid;
        c.style.width = 0;
        c.style.height = 0;
        c.style.opacity = 0;
        c.style.overflow = 'hidden';
        document.body.appendChild(c);
    }
    return c;
})();

const div = document.createElement('div');
div.style.backgroundImage = images.map(url => 'url(' + url + ')').join(',');
container.appendChild(div);
`;
    }

    protected getStyle() {
        return '';
    }

    protected getScript() {
        return '';
    }

    public create() {
        if (this.imageRequired && !this.config.images.length) {
            return '';
        }

        const style = this.compileCSS(this.getStyle());
        const script = this.getScript().trim();

        return [
            this.getPreload(),
            (() => {
                if (!style.length) {
                    return '';
                }
                return `
                const style = document.createElement("style");
                style.textContent = ${JSON.stringify(style)};
                document.head.appendChild(style);`;
            })(),
            script
        ]
            .filter(n => !!n.length)
            .map(n => _.withIIFE(n))
            .join(';');
    }
}

export class WithoutImagesPatchGenerator extends AbsPatchGenerator<any> {
    constructor() {
        super({ images: [] });
    }

    protected readonly imageRequired = false;
}
