//主要逻辑控制

var background = require('./background');
var vshelp = background.vshelp;

function reset(imgs) {   //重置
    background.search()
        .then(installPath => {
            background.init(installPath, imgs);
        })
        .catch(() => {
            background.init('', imgs);
        });
}

function setImgs() {   //设置图片
    vshelp.prompt({
        value: '',
        prompt: "Enter the url of 3 images,split with ',' (输入3个图片地址，用逗号分隔)",
        placeHolder: "for example(比如)：file:///E:/memeda.png,none,http://memeda.jpg"
    }).then(imgs => {
        if (!imgs) return;

        reset(imgs.split(','));
    });
}

function uninstall() {
    background.uninstall();
}

module.exports = {
    reset: reset,
    setImgs: setImgs,
    uninstall: uninstall,
    dispose: function () {
        vshelp.dispose();
    }
};