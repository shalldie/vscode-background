var defBase64 = require('./defBase64');
var version = require('./version');

/**
 * 生成css样式
 */
module.exports = function (arr) {
    var img0, img1, img2;

    if (arr && arr.length) { // 如果传入的有参数

        img0 = encodeURI(arr[0] || "none");
        img1 = encodeURI(arr[1] || "none");
        img2 = encodeURI(arr[2] || "none");

    } else { // 如果没有参数，则使用默认值
        img0 = defBase64[0];
        img1 = defBase64[1];
        img2 = defBase64[2];
    }

    var content = `
    
/*css-background-start*/
/*background.ver.${version}*/
.editor-one .editor-container .monaco-scrollable-element{background-image: url('${img0}');}

.editor-two .editor-container .monaco-scrollable-element{background-image: url('${img1}');}

.editor-three .editor-container .monaco-scrollable-element{background-image: url('${img2}');}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

.one-editor-silo .editor-container .monaco-scrollable-element{background-position:100% 100%;background-repeat:no-repeat;}
/*css-background-end*/
`;

    return content;
}