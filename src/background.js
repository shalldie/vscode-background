var fs = require('fs');
var path = require('path');

var getCss = require('./getCss');
var vscodePath = require('./vscodePath');

/**
 * 移除旧版本文件
 */
function removeOld() {
    var loaderPath = path.join(vscodePath.indexDir, 'ext-loader.js'); // ext-loader.js 的路径

    if (fs.existsSync(loaderPath)) { // 如果之前安装过旧版本，则移除
        console.log('安装过旧版本，移除');

        fs.unlinkSync(loaderPath);

        console.log('删除成功...');

        console.log('删除原来文件入口 index.html 中的内容');

        var indexPath = path.join(vscodePath.indexDir, 'index.html');
        var html = fs.readFileSync(indexPath, 'utf-8'); // 入口文件的内容
        html = html.replace(/<!--extstart-->[\s\S]*?<!--extend-->/, ''); // 移除旧插件植入的script
        fs.writeFileSync(indexPath, html, 'utf-8');

        console.log('删除成功...');
        return 1;
    }
    return 0;
}

/**
 * 载入图片
 * 
 * @param {any} arr
 */
function installImg(arr, randChoice) {
    uninstallImg();
    var content = getCss(arr, randChoice).replace(/\s*$/, ''); // 去除末尾空白

    var cssContent = fs.readFileSync(vscodePath.cssPath, 'utf-8') + content;

    fs.writeFileSync(vscodePath.cssPath, cssContent, 'utf-8');
}

/**
 * 删除图片
 */
function uninstallImg() {
    var content = fs.readFileSync(vscodePath.cssPath, 'utf-8');
    content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//, '');
    content = content.replace(/\s*$/, '');
    fs.writeFileSync(vscodePath.cssPath, content, 'utf-8');
}

module.exports = {
    removeOld: removeOld,
    installImg: installImg,
    uninstallImg: uninstallImg
};