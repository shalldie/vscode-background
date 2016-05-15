
var vscode = require('vscode');

var statusBar;  //左下角提示框，单例

// vscode 辅助类
class VsHelp {

    //提示框，return thenable
    static prompt(options) {   //输入框
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

    static showInfo(content) {  //信息提示框
        return vscode.window.showInformationMessage(content);
    }

    static showError(error) {  //错误提示框
        return vscode.window.showErrorMessage(error);
    }

    // 左下角状态信息  return thenable
    static showStatusBar(content, delay) {
        if (!statusBar) statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

        var time = +new Date
        statusBar.time = time;  //时间戳，闭包用来检测是否最后一次操作

        statusBar.text = content;
        statusBar.show();

        if (!delay) {   //如果没有持续时间
            return new Promise(resolve => resolve());
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        }).then(() => {
            if (statusBar.time != time) return;  //只以最后一次操作为准
            statusBar.text = "";
            statusBar.hide();
        });
    }

    // 选择菜单

    static showQuickPick() {
        var QuickPickItem = vscode.QuickPickItem;
        var item = new QuickPickItem();
        // vscode.showQuickPick(['hello'],)
    }

    static dispose() {
        if (statusBar) {
            statusBar.dispose();
        }
    }

}

module.exports = VsHelp;