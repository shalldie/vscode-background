import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { compile, serialize, stringify } from 'stylis';
import { VERSION, BACKGROUND_VER } from '../../constants';

/**
 * 用于触发开发工具 css in js 语言支持
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
     * 使用 file 协议加载图片文件并转为 base64
     *
     * @protected
     * @param {string} url 图片路径
     * @return {*}  {Promise<string>}
     * @memberof AbsCssGenerator
     */
    protected async loadImageBase64FromFileProtocol(url: string): Promise<string> {
        const fileUrl = new URL(url);
        const buffer = await fs.promises.readFile(fileUrl);
        const extName = path.extname(fileUrl.pathname).substring(1);

        return `data:image/${extName};base64,${buffer.toString('base64')}`;
    }

    /**
     * 图片预处理
     * 在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
     * 当检测到配置文件使用 file 协议时, 需要将图片读取并转为 base64, 而后再插入到 css 中
     * @protected
     * @param {string[]} images 图片列表
     * @return {*}
     * @memberof AbsCssGenerator
     */
    protected async normalizeImages(images: string[]) {
        const list: string[] = []; // 处理后的图片列表

        for (const url of images) {
            const handledUrl = url.startsWith('file://') ? await this.loadImageBase64FromFileProtocol(url) : url;
            list.push(handledUrl);
        }

        return list;
    }

    /**
     * 编译 css
     */
    protected compileCSS(source: string) {
        return serialize(compile(source), stringify);
    }

    protected abstract getCss(options: T): Promise<string>;

    public async create(options: T) {
        const imageStyleContent = await this.getCss(options);

        const content = `
        /*css-background-start*/
        /*${BACKGROUND_VER}.${VERSION}*/
        ${imageStyleContent}
        /*css-background-end*/
        `;

        return content;
    }
}
