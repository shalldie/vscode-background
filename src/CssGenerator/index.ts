import { DefaultGeneratorOptions } from './CssGenerator.default';
import { FullScreenGeneratorOptions } from './CssGenerator.fullscreen';

export type TCssGeneratorOptions = DefaultGeneratorOptions & FullScreenGeneratorOptions;

export class CssGenerator {
    // eslint-disable-next-line
    public static create(options: TCssGeneratorOptions) {}
}
