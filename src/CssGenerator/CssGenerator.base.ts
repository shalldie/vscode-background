import fsp from 'fs/promises';
import path from 'path';
import { URL } from 'url';
import { VERSION, BACKGROUND_VER } from '../constants';

export abstract class AbsCssGenerator {
    /**
     * 通过配置获取样式文本
     *
     * @protected
     * @param {object} options 用户配置
     * @param {boolean} useFront 是否前景图
     * @return {*}  {string}
     * @memberof AbsCssGenerator
     */
    protected getStyleByOptions(options: object, useFront: boolean): string {
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
     *
     * @protected
     * @param {string} url 图片路径
     * @return {*}  {Promise<string>}
     * @memberof AbsCssGenerator
     */
    protected async loadImageBase64FromFileProtocol(url: string): Promise<string> {
        const fileUrl = new URL(url);
        const buffer = await fsp.readFile(fileUrl);
        const extName = path.extname(fileUrl.pathname).substring(1);

        return `data:image/${extName};base64,${buffer.toString('base64')}`;
    }

    /**
     * 图片预处理
     *
     * @protected
     * @param {string[]} images 图片列表
     * @return {*}
     * @memberof AbsCssGenerator
     */
    protected async normalizeImages(images: string[]) {
        /*
          图片预处理
          在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
          当检测到配置文件使用 file 协议时, 需要将图片读取并转为 base64, 而后再插入到 css 中
        */

        const list: string[] = []; // 处理后的图片列表

        for (const url of images) {
            const handledUrl = url.startsWith('file://') ? await this.loadImageBase64FromFileProtocol(url) : url;
            list.push(handledUrl);
        }

        return list;
    }

    protected abstract getCss(options: any): Promise<string>;

    public async create(options: any) {
        const imageStyleContent = await this.getCss(options);

        const content = `
        /*css-background-start*/
        /*${BACKGROUND_VER}.${VERSION}*/
        ${imageStyleContent}
        [id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}
        /*css-background-end*/
        `;

        return content;
    }
}
