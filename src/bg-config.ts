/**
 * 注明哪些编辑器需要背景
 */
interface ApplyEditors {
    code: boolean;
    started: boolean;
    extension: boolean;
    difference: boolean;
    settings: boolean;
    empty: boolean;
}

interface ApplyOpacities {
    decorationsOverviewRuler: number;
}

export interface VSCodeBackgroundConfig {
    /**
     * 启用插件
     */
    enable: boolean;

    /**
     * 将图片叠在编辑器前面
     */
    useFront: boolean;

    /**
     * 使用build-in图片
     */
    useDefault: boolean;

    /**
     * 公共样式
     */
    style: any;

    /**
     * 独立样式
     */
    styles: any[];

    /**
     * 自定义图片
     */
    customImages: string[];

    /**
     * 循环展示图片
     */
    loop: boolean;
    /**
     * 需要背景的编辑器
     */
    editors: ApplyEditors;
    opacities: ApplyOpacities;
}
