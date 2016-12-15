var path = require('path');

var base = path.dirname(require.main.filename); // 基础目录

var cssPath = path.join(base, 'vs', 'workbench', 'electron-browser', 'workbench.main.css'); // css文件路径

var indexDir = path.join(base, 'vs', 'workbench', 'electron-browser', 'bootstrap'); // electron 入口文件所在文件夹


module.exports = {
    base: base,
    cssPath: cssPath,
    indexDir: indexDir
};