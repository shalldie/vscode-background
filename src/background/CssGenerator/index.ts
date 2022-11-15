import { DefaultCssGenerator, DefaultGeneratorOptions } from './CssGenerator.default';
import { FullScreenCssGenerator, FullScreenGeneratorOptions } from './CssGenerator.fullscreen';
import { RotatingCssGenerator, RotatingGeneratorOptions } from './CssGenerator.rotating';

/**
 * 配置项参数
 */
export type TCssGeneratorOptions = DefaultGeneratorOptions & {
    enabled: boolean;
    fullscreen?: FullScreenGeneratorOptions;
    rotating?: RotatingGeneratorOptions;
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
        if (options.rotating?.enabled) {
            return new RotatingCssGenerator().create({ ...options, ...options.rotating });
        }

        return new DefaultCssGenerator().create(options);
    }
}
