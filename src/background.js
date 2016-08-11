// 该文件负责主要插件功能

//E:\Microsoft VS Code\resources\app\out\vs\workbench\electron-browser

var vshelp = require('./vshelp');
var path = require('path');
var fs = require('fs');
var child = require('child_process');

var dirPath = "";     //主要文件夹路径
var indexPath = "";   //electron入口html

function search() {
    vshelp.showStatusBar('searching...', 3000);

    return new Promise((resolve, reject) => {
        child.exec('reg query HKEY_CLASSES_ROOT\\*\\shell\\VSCode /v Icon', function (error, strOut, strError) {
            vshelp.showStatusBar('Search is complated.', 3000);
            if (error) {
                console.log(error);
                vshelp.showStatusBar('Query error!  Please enter the path by yourself.(没找到安装目录，请自己输入吧...)', 10000);
                reject(error);
                return;
            }

            var exePath = strOut.match(/REG_EXPAND_SZ\s+(\S[\s\S]*exe)/)[1];
            var installPath = path.dirname(exePath || '');        //获取安装目录

            resolve(installPath);
        });
    });

}

function init(value, arr, noAction) {      //逻辑入口

    return vshelp.prompt({
        value: value || "",
        prompt: "Please enter the path of your vscode (请输入您的vscode安装目录)",
        placeHolder: "for example(比如)： E:\\Microsoft VS Code"
    }).then(baseUrl => {
        if (!baseUrl) return;

        if (!judgePath(baseUrl)) return;

        if (noAction) return;

        //注入 script 到 index.html
        fillInScript();

        //设置默认图片，保存脚本到dirPath
        createLoader(arr);

        vshelp.showInfo('Background has been changed! Please restart.');
    });
}


function judgePath(inputPath) {  //校验并填充路径

    var _dirPath = path.join(inputPath, 'resources\\app\\out\\vs\\workbench\\electron-browser');

    if (!judgeDirPath(_dirPath)) return false;
    dirPath = _dirPath;

    var _indexPath = path.join(dirPath, 'index.html');

    if (!judgeIndexPath(_indexPath)) return false;
    indexPath = _indexPath;

    return true;
}


function judgeDirPath(dirPath) {                 //判断main文件夹是否存在
    var hasDir = fs.existsSync(dirPath);

    if (!hasDir) {  //路径不合法
        vshelp.showError("Something wrong with the path you gave.")
    }

    return hasDir;
}

function judgeIndexPath(indexPath) {              //判断index.html 是否存在
    var hasFile = fs.existsSync(indexPath);

    if (!hasFile) {  //路径不合法
        vshelp.showError("Your index.html missing!!!")
    }

    return hasFile;
}

function fillInScript() {               //注入脚本到index.html
    var html = fs.readFileSync(indexPath, 'utf-8');

    html = html.replace(/<!--extstart-->[\s\S]*?<!--extend-->/, '');

    html = html.replace(/(<\/body>)/, `<!--extstart--><script src="ext-loader.js"></script><!--extend--> $1`);

    fs.writeFileSync(indexPath, html);
}

function removeTheScript() {            //移除index.html的脚本文件
    var html = fs.readFileSync(indexPath, 'utf-8');

    html = html.replace(/<!--extstart-->[\s\S]*?<!--extend-->/, '');

    fs.writeFileSync(indexPath, html);

    vshelp.showInfo('Background has been removed! Please restart.')
}

function uninstall() {
    search().then(inputPath => {
        init(inputPath, null, true).then(() => {
            removeTheScript();
        });
    });
}

function createLoader(arr) {            //创建脚本入口文件
    var html = fs.readFileSync(path.join(__dirname, 'ext-loader.js'), 'utf-8');
    var index = 0;
    if (!arr) {
        arr = require('./defSrc');
    }

    if (arr && arr.length) {                                                //修改background-image
        html = html.replace(/url\((\S*?)\)/g, function (g0, g1) {
            var url = arr[index++];
            return url ? `url(${url})` : 'none';
        });
    }

    var scriptPath = path.join(dirPath, "ext-loader.js");
    fs.writeFileSync(scriptPath, html);
}

module.exports = {
    vshelp: vshelp,
    search: search,  //搜索安装目录
    init: init,      //初始化
    // setImg: setImg,   //设置图片地址
    uninstall: uninstall  //移除index中的脚本
};