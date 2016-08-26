var vscode = require('vscode');

/**
 * 提示辅助工具类
 * 
 * @class VsHelp
 */
class VsHelp {

    /**
     * 输入框
     * 
     * @static
     * @param {any} options
     * @returns promise
     */
    static prompt(options) {
        // options:
        // {
        //     password?: boolean                            是否密文
        //     placeHolder?: string                          水印
        //     prompt?: string                               title文字
        //     validateInput?: (value: string) => string     ？？？
        //     value?: string                                默认值
        // }

        var dict = {
            "string": { prompt: options },
            "object": options
        };

        var type = typeof options;
        options = dict[type] || {};

        return vscode.window.showInputBox(options);
    }

    /**
     * 信息提示框
     * 
     * @static
     * @param {any} content
     * @returns promise
     */
    static showInfo(content) {
        return vscode.window.showInformationMessage(content);
    }

    /**
     * 错误提示框
     * 
     * @static
     * @param {any} error
     * @returns promise
     */
    static showError(error) {
        return vscode.window.showErrorMessage(error);
    }
}

module.exports = VsHelp;