import { AbsCssGenerator, css } from './CssGenerator.base';

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
        let { size, opacity, image } = {
            ...new FullScreenGeneratorOptions(),
            ...options
        };

        // ------ 处理图片 ------
        image = (await this.normalizeImages([image]))[0];

        const styles = css`
            body {
                background-size: ${size};
                background-repeat: no-repeat;
                background-position: center;
                opacity: ${opacity};
                background-image: url('${image}');
            }
        `;

        return this.compileCSS(styles);
    }
}
