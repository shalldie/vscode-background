import { DefaultCssGenerator, DefaultGeneratorOptions } from './CssGenerator.default';
import { FullScreenCssGenerator, FullScreenGeneratorOptions } from './CssGenerator.fullscreen';

/**
 * 配置项参数
 */
export type TCssGeneratorOptions = DefaultGeneratorOptions & {
    enabled: boolean;
    fullscreen?: FullScreenGeneratorOptions;
};

/**
 * 样式生成工厂
 *
 * @export
 * @class CssGenerator
 */
export class CssGenerator {
    public static create(options: TCssGeneratorOptions) {
        if (options.fullscreen?.image) {
            return new FullScreenCssGenerator().create(options.fullscreen);
        }

        return new DefaultCssGenerator().create(options);
    }
}
