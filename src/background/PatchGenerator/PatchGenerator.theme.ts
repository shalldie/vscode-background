import { css, WithoutImagesPatchGenerator } from './PatchGenerator.base';

export class ThemePatchGenerator extends WithoutImagesPatchGenerator {
    /**
     * 混合模式使用 css variable
     *
     * @static
     * @memberof ThemePatchGenerator
     */
    static readonly cssMixBlendMode = '--background-css-mix-blend-mode';

    protected getStyle(): string {
        return css`
            // 浅色主题（默认）
            body {
                // 不使用混合模式
                ${ThemePatchGenerator.cssMixBlendMode}: unset;
            }

            // 深色主题 (覆盖)，避免使用 :root
            body:has(> .monaco-workbench.vs-dark) {
                // 使用混合模式
                ${ThemePatchGenerator.cssMixBlendMode}: screen;
            }
        `;
    }
}
