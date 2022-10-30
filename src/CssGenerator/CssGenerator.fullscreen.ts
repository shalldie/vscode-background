import { AbsCssGenerator } from './CssGenerator.base';

export class FullScreenGeneratorOptions {
    url = '';
    opacity = 1;
}

export class FullScreenCssGenerator extends AbsCssGenerator {
    protected async getCss(options: FullScreenGeneratorOptions) {
        options = {
            ...options,
            ...new FullScreenGeneratorOptions()
        };

        options.url = this.normalizeImages([options.url])[0];

        return `
        body{
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			opacity:${options.opacity};
			background-image:url('${options.url}');
		}`;
    }
}
