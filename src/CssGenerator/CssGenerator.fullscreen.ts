import { AbsCssGenerator } from './CssGenerator.base';

/**
 * 全屏配置
 *
 * @export
 * @class FullScreenGeneratorOptions
 */
export class FullScreenGeneratorOptions {
    image = '';
    opacity = 0.91; // 建议在 0.85 ~ 0.95 之间微调
    size = 'cover' as 'cover' | 'contain';
}

/**
 * 全屏样式生成
 *
 * @export
 * @class FullScreenCssGenerator
 * @extends {AbsCssGenerator<FullScreenGeneratorOptions>}
 */
export class FullScreenCssGenerator extends AbsCssGenerator<FullScreenGeneratorOptions> {
    protected async getCss(options: FullScreenGeneratorOptions) {
        // 处理默认参数
        options = {
            ...new FullScreenGeneratorOptions(),
            ...options
        };

        options.image = (await this.normalizeImages([options.image]))[0];

        return `
        body {
            background-size: ${options.size};
            background-repeat: no-repeat;
            background-position: center;
            opacity:${options.opacity};
            background-image:url('${options.image}');
        }`;
    }
}
