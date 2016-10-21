var defBase64 = require('./defBase64');
var version = require('./version');

/**
 * 生成css样式
 */
module.exports = function(arr, opacity, size) {
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

    var opc;
    if (opacity && opacity >= 0 && opacity <= 100) {
        opc = opacity / 100;
    } else {
        opc = 0.7;
    }
    var content = `
    
/*css-background-start*/
/*background.ver.${version}*/
[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(1) .overflow-guard>.monaco-scrollable-element{background:linear-gradient(to bottom, rgba(0,0,0,${opc}) 0%,rgba(0,0,0,${opc}) 100%), url('${img0}') no-repeat fixed;
	background-position:center;background-size:${size[0]};}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(3) .overflow-guard>.monaco-scrollable-element{background:linear-gradient(to bottom, rgba(0,0,0,${opc}) 0%,rgba(0,0,0,${opc}) 100%), url('${img1}') no-repeat fixed;
	background-position:center;background-size:${size[1]};}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(5) .overflow-guard>.monaco-scrollable-element{background:linear-gradient(to bottom, rgba(0,0,0,${opc}) 0%,rgba(0,0,0,${opc}) 100%), url('${img2}') no-repeat fixed;
	background-position:center;background-size:${size[2]};}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}