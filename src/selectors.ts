/* 预定义的选择器
 * 这个文件中保存着所有的选择器常量
 */

/**
 * 目标选择器构建函数
 */
export type TargetSelectorBuilder = (nth?: string) => string;

/**
 * 选择器构建函数
 */
export type SelectorBuilder = (isFront: boolean) => Selector;

/**
 * 选择器
 */
export interface Selector {
    /**
     * 该选择器指向的元素将会被设置背景
     */
    target: TargetSelectorBuilder;
    /**
     * 数组内的选择器指定的元素的背景样式将会被设置为 none
     */
    remove?: string[];
}

/**
 * private 通用的选择器根
 */
const _commonBase = '[id="workbench.parts.editor"] .split-view-view';
/**
 * 构建通用选择器
 * @param nth :nth-child(nth) 为空则不添加伪类
 * @returns 包含或不包含nth-child伪类的选择器
 */
const commonBase = (nth?: string) => (nth ? `${_commonBase}:nth-child(${nth})` : _commonBase);
/**
 * 根据isFront获取伪类
 * @param isFront
 * @returns
 */
const pseudo = (isFront: boolean) => (isFront ? 'before' : 'after');

export const selectors: {
    [key: string]: SelectorBuilder;
} = {
    /**
     * 代码编辑器
     */
    code: isFront => {
        const common = `.editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element`;
        return {
            target: nth => `${commonBase(nth)} ${common}::${pseudo(isFront)}`,
            remove: [`${commonBase()} ${common}>.monaco-editor-background`]
        };
    },
    /**
     * 开始页面
     */
    started: isFront => ({
        target: nth =>
            `${commonBase(nth)} .editor-container .editor-instance>.gettingStartedContainer::${pseudo(isFront)}`
    }),
    /**
     * 扩展编辑器
     */
    extension: isFront => ({
        target: nth => `${commonBase(nth)} .editor-container .editor-instance>.extension-editor::${pseudo(isFront)}`
    }),
    /**
     * 差异编辑器
     */
    difference: isFront => {
        const common = '.editor-container .editor-instance>.monaco-diff-editor';
        const removeBase = `${commonBase()} ${common}`;
        return {
            target: nth => `${commonBase(nth)} ${common} .editor .monaco-editor::${pseudo(isFront)}`,
            remove: [
                //
                removeBase,
                `${removeBase} .editor>.monaco-editor`,
                `${removeBase} .editor>.monaco-editor .monaco-editor-background`
            ]
        };
    },
    /**
     * 设置编辑器
     */
    settings: isFront => {
        const common = '.editor-container .editor-instance>.settings-editor';
        const removeBase = `${commonBase()} ${common} .settings-body .split-view-container .settings-tree-container>.monaco-list>.monaco-scrollable-element>.monaco-list-rows`;
        return {
            target: nth => `${commonBase(nth)} ${common}::${pseudo(isFront)}`,
            remove: [
                removeBase,
                `${removeBase}>.monaco-list-row`,
                `${removeBase}>.monaco-list-row.focused`,
                `${removeBase}>.monaco-list-row.selected`
            ]
        };
    },
    /**
     * 空
     */
    empty: isFront => ({
        target: nth => `${commonBase(nth)} .empty::${pseudo(isFront)}`
    })
};
