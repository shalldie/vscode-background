import { AbsCssGenerator, css } from './CssGenerator.base';

/**
 * ## 更加自由的CSS生成器
 * @author @frg2089
 *
 * 理论上讲，这个生成器将不会照顾普通用户的感受，它仅面向拥有一定CSS能力的前端用户。
 *
 * 根据 @shalldie 在 #303 处所说的内容，默认的生成器的作用范围是【代码区域】
 * 所以这里提供一个更加高级的CSS生成器，它面向希望拥有更高自定义程度，又不想自己写扩展的用户。
 *
 */
export class AdvancedCssGenerator extends AbsCssGenerator<AdvancedCssGeneratorOptions> {
    protected async getCss(o: AdvancedCssGeneratorOptions): Promise<string> {
        if (!isOptions(o)) {
            // TODO: 项目没有引入nls，此处不翻译
            throw new Error('配置不正确');
        }
        // 处理图片
        this.normalizeImageUrls(o.images.map(i => i.uri)).forEach((uri, i) => (o.images[i].uri = uri));

        return isCarouselOptions(o) ? getCarouselCss(o) : getNormalCss(o);
    }
}

/**
 * 图片
 */
interface Image {
    /**
     * 自定义图片的地址
     */
    uri: string;
}
/**
 * 带样式的图片
 */
interface StyledImage extends Image {
    /**
     * 自定义的图片样式
     */
    style: Record<string, string>;
}

/**
 * 自由CSS生成器配置项
 */
interface AdvancedCssGeneratorOptions {
    /**
     * 通用样式
     *
     * 应用到所有图片上的CSS样式
     */
    style?: Record<string, string>;
    /**
     * 自定义图片的列表
     */
    images?: Image[];
    /**
     * 是否不要循环图片
     *
     * 当值为`true`时，图片池耗尽后将不再显示图片，轮播图将停止
     */
    isLoopDisabled?: boolean;
    /**
     * 幻灯片模式
     */
    carouselInterval?: number;
    /**
     * 将要应用图片的目标选择器
     *
     * 若是伪类则自动添加content属性
     */
    targets?: string[];
}

interface CssGeneratorNormalOptions extends AdvancedCssGeneratorOptions {
    style: Record<string, string>;
    images: Image[];
    targets: string[];
}
interface CssGeneratorCarouselOptions extends CssGeneratorNormalOptions {
    carouselInterval: number;
}
/**
 * 图片类型守卫
 * @param image
 * @returns
 */
const isStyledImage = (image: Image): image is StyledImage => 'style' in image;
/**
 * 类型守卫
 * @param o
 * @returns
 */
export const isOptions = (options: AdvancedCssGeneratorOptions): options is CssGeneratorNormalOptions => {
    if (!('style' in options)) return false;
    if (!('images' in options)) return false;
    if (!('targets' in options)) return false;
    return true;
};

/**
 * 类型守卫
 * @param o
 * @returns
 */
const isCarouselOptions = (o: AdvancedCssGeneratorOptions): o is CssGeneratorCarouselOptions =>
    'carouselInterval' in o && typeof o.carouselInterval === 'number' && o.carouselInterval !== 0;

const toPercent = (num: number) => (num * 100).toFixed(3) + '%';
const createKeyFrames = (images: Image[], interval: number, i: number, animationIterationCount: string) => {
    if (i !== 0) images.push(images.shift()!);

    const current = images[i];
    const identifier = `background-free-carousel-${i}`;

    const perDuration = 0.6 / (interval * images.length); // 渐变时间/动画总时长，渐变时间在总时长中占比
    const perFrame = 1 / images.length; // 每片时长 eg: 0.5

    const frames = [...images, images[0]].map((image, i) => ({
        from: toPercent(Math.max(i * perFrame - perDuration * 0.5, 0)),
        to: toPercent(Math.min((i + 1) * perFrame - perDuration * 1.5, 1)),
        image
    }));

    return css`
        animation: ${identifier} ${images.length * interval}s ${animationIterationCount};
        ${isStyledImage(current) ? getCssByRecord(current.style) : ''}
        @keyframes ${identifier} {
            ${frames.map(
                ({ from, to, image }) => css`
                    ${from}, ${to} {
                        background-image: url('${image.uri}');
                        ${isStyledImage(image) ? getCssByRecord(image.style) : ''}
                    }
                `
            )}
        }
    `;
};
/**
 * 生成轮播样式
 * @param o
 * @returns
 */
const getCarouselCss = (o: CssGeneratorCarouselOptions): string => {
    const animationIterationCount = o.isLoopDisabled ? '1' : 'infinite';
    const interval = o.carouselInterval;

    return o.images
        .map((image, i, arr) => {
            const nthChild = o.isLoopDisabled ? `${i + 1}` : `${arr.length}n + ${i + 1}`;
            const selectors = o.targets.map(s => s.replaceAll('${nth}', nthChild)).join(',\n');

            return css`
                ${selectors} {
                    background-image: url('${image.uri}');
                    ${getCssByRecord(o.style)}
                    ${createKeyFrames(arr, interval, i, animationIterationCount)}
                }
            `;
        })
        .join('\n');
};
/**
 * 生成普通样式
 * @param o
 * @returns
 */
const getNormalCss = (o: CssGeneratorNormalOptions): string => {
    return o.images
        .map((image, i) => {
            const nthChild = o.isLoopDisabled ? `${i + 1}` : `${o.images.length}n + ${i + 1}`;
            const selectors = o.targets.map(s => s.replaceAll('${nth}', nthChild)).join(',\n');

            return css`
                ${selectors} {
                    background-image: url('${image.uri}');
                    ${isStyledImage(image) ? getCssByRecord({ ...o.style, ...image.style }) : ''}
                }
            `;
        })
        .join('\n');
};
/**
 * Record 转 CSS
 * @param style
 * @returns
 */
const getCssByRecord = (style: Record<string, string>): string =>
    Object.entries(style)
        .map(([key, value]) => `${key}: ${value};`)
        .join('');
