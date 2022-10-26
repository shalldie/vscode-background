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
    style: {
        [key: string]: string | number;
    };

    /**
     * 独立样式
     */
    styles: {
        [key: string]: string | number;
    }[];

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
    editors: {
        code: boolean;
        started: boolean;
        extension: boolean;
        difference: boolean;
        settings: boolean;
        empty: boolean;
        fullscreen: boolean;
    };
    opacities: {
        decorationsOverviewRuler: number;
    };
    lab: {
        /**
         * 使用 vscode-file:// 协议而不是 data: 协议(base64)处理本地文件
         */
        useVscodeFileUri: boolean;
    };
}
