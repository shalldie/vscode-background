var background = require('./background');
var vsHelp = require('./vshelp');
var fs = require('fs');
var path = require('path');

function showSuccess() {
    vsHelp.showInfoRestart('Background has been changed! Please restart.');
}

/**
 * 重置到默认值
 */
function reset() {
    background.installImg();
    showSuccess();
}

/**
 * 设置自选图片
 */
function setImgs() {
    vsHelp.prompt({
        value: '',
        prompt: "Enter the url of 3 images,split with ',' (输入3个图片地址，用逗号分隔)",
        placeHolder: "for example(比如)：file:///E:/memeda.png,none,http://memeda.jpg"
    }).then(imgs => {
        if (!imgs) return;

        background.installImg(imgs.split(','));
        showSuccess();
    });
}

/**
 * 移除背景图
 */
function uninstall() {
    background.uninstallImg();
    showSuccess();
}


/**
 * 检测是否第一次加载，用于提示用户使用f1，并移除旧版本
 */
function firstLoad() {
    var configPath = path.join(__dirname, 'config', 'config.json');
    var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (info.firstload) {
        var hasOld = background.removeOld();
        var content = hasOld ? 'Ver. old uninstalled. ' : '';

        vsHelp.showInfo(content + 'Please press F1 and enter background to chose Commond!');
        info.firstload = false;
        fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
    }
}

module.exports = {
    reset: reset,
    setImgs: setImgs,
    uninstall: uninstall,
    firstLoad: firstLoad
};


