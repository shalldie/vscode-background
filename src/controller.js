var background = require('./background');
var vsHelp = require('./vsHelp');
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
        prompt: "Enter the url of images,split with ',' (输入图片地址，多个地址用逗号分隔)",
        placeHolder: "for example(比如)：file:///E:/memeda.png,none,http://memeda.jpg"
    }).then(imgs => {
        if (!imgs) return;

        var configPath = path.join(__dirname, 'config', 'config.json');
        var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        info.images = imgs.split(',');
        background.installImg(info.images, info.randChoice);
        info.installed = true;
        fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
        showSuccess();
    });
}

/**
 * 移除背景图
 */
function uninstall() {
    background.uninstallImg();
    var configPath = path.join(__dirname, 'config', 'config.json');
    var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    info.installed = false;
    fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
    showSuccess();
}


/**
 * 每当窗口激活
 */
function onActive() {
    // 检测是否第一次加载，用于提示用户使用f1，并移除旧版本
    var configPath = path.join(__dirname, 'config', 'config.json');
    var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (info.firstload) {
        var hasOld = background.removeOld();
        var content = hasOld ? 'Ver. old uninstalled. ' : '';

        vsHelp.showInfo(content + 'Please press F1 and enter background to chose Commond!');
        info.firstload = false;
        fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
    } else if (info.installed) {
        background.installImg(info.images, info.randChoice);
    }
}

/**
 * 切换是从随机位置开始第一张图
 */
function changeRandChoice() {
    var configPath = path.join(__dirname, 'config', 'config.json');
    var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    info.randChoice = !info.randChoice;
    vsHelp.showInfo('Random Choice first image function was ' + (info.randChoice ? "opened" : "closed"));
    fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
}

module.exports = {
    reset: reset,
    setImgs: setImgs,
    uninstall: uninstall,
    onActive: onActive,
    changeRandChoice: changeRandChoice
};


