import { ColorThemeKind } from 'vscode';
import { DefaultCssGenerator, DefaultGeneratorOptions } from './CssGenerator.default';
import { FullScreenCssGenerator, FullScreenGeneratorOptions } from './CssGenerator.fullscreen';

/**
 * 配置项参数
 */
export type TCssGeneratorOptions = DefaultGeneratorOptions & {
    enabled: boolean;
    fullscreen?: FullScreenGeneratorOptions;
    darkFullscreen?: FullScreenGeneratorOptions;
};

/**
 * 样式生成工厂
 *
 * @export
 * @class CssGenerator
 */
export class CssGenerator {
    public static create(options: TCssGeneratorOptions) {
        if (options.fullscreen?.image?.length) {
            const modeImages = CssGenerator.getImages(options);
            return new FullScreenCssGenerator().create(modeImages!);
        }

        return new DefaultCssGenerator().create(options);
    }
    public static getImages(options: TCssGeneratorOptions) {
        if (options.useThemeMode && options.curMode === ColorThemeKind.Dark) {
            return options.darkFullscreen ?? options.fullscreen;
        }
        return options.fullscreen;
    }
}
