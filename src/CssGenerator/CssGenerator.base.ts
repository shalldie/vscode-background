import { Uri } from 'vscode';
import fsp from 'fs/promises';
import path from 'path';
import { URL } from 'url';
import { VERSION, BACKGROUND_VER } from '../constants';

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
        const buffer = await fsp.readFile(fileUrl);
        const extName = path.extname(fileUrl.pathname).substring(1);

        return `data:image/${extName};base64,${buffer.toString('base64')}`;
    }
    /**
     * 使用 file 协议加载图片文件并转为 vscode-file://vscode-app
     *
     * @protected
     * @param {string} path 图片路径
     * @return {*}  {Promise<string>}
     * @memberof AbsCssGenerator
     */
    protected async loadImageUriFromFileProtocol(path: string): Promise<string> {
        const uri =
            // 判断path是否是本地文件路径
            // 通常情况下
            // Unix-like 文件系统完整路径以 '/' 开头
            // Windows 文件系统完整路径 第二个字符一定是 ':'
            path.startsWith('file://') || path.startsWith('/') || path.startsWith(':', 1)
                ? Uri.file(path.replace('file://', '')) // 从文件路径转换成Uri
                : Uri.parse(path, true); // 试图将字符串转换成Uri

        if (uri.scheme !== 'file') return uri.toString();

        // vscode-file://vscode-app/path/to/file
        // https://github.com/microsoft/vscode/blob/main/src/vs/platform/protocol/electron-main/protocolMainService.ts#L22
        // vscode-file:// https://github.com/microsoft/vscode/blob/main/src/vs/base/common/network.ts#L93
        return `vscode-file://vscode-app${uri.path}`;
    }

    /**
     * 图片预处理
     *
     * @protected
     * @param {string[]} images 图片列表
     * @return {*}
     * @memberof AbsCssGenerator
     */
    protected async normalizeImages(images: string[], useVscodeFileProtocol?: boolean) {
        /*
          图片预处理
          在 v1.51.1 版本之后, vscode 将工作区放入 sandbox 中运行并添加了 file 协议的访问限制, 导致使用 file 协议的背景图片无法显示
          当检测到配置文件使用 file 协议时, 需要将图片读取并转为 base64, 而后再插入到 css 中
        */

        const list: string[] = []; // 处理后的图片列表

        if (!useVscodeFileProtocol) {
            for (const url of images) {
                const handledUrl = url.startsWith('file://') ? await this.loadImageBase64FromFileProtocol(url) : url;
                list.push(handledUrl);
            }
        } else {
            for (const url of images) {
                const handledUrl = await this.loadImageUriFromFileProtocol(url);
                list.push(handledUrl);
            }
        }

        return list;
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
