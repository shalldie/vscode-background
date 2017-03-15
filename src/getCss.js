var defBase64 = require('./defBase64');
var version = require('./version');

/**
 * 生成css样式
 */
module.exports = function (arr, randomOrder) {
    var img0, img1, img2;

    (function (arr, randomOrder) {
        var size = arr.length;
        var index = randomOrder ? parseInt(size * Math.random()) : 0;
        img0 = arr[index++ % size] || "none";
        img1 = arr[index++ % size] || "none";
        img2 = arr[index++ % size] || "none";
    })((arr && arr.length && arr) || defBase64, randomOrder);

    img0 = img0.replace('url(none)', '');
    img1 = img1.replace('url(none)', '');
    img2 = img2.replace('url(none)', '');

    var content = `
    
/*css-background-start*/
/*background.ver.${version}*/
.editor-one>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2){background-image: url('${img0}');}

.editor-two>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2){background-image: url('${img1}');}

.editor-three>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2){background-image: url('${img2}');}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2){background-position:100% 100%;background-repeat:no-repeat;}
/*css-background-end*/
`;

    return content;
}