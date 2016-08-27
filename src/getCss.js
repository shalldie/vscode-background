var defBase64 = require('./defBase64');

/**
 * 生成css样式
 */
module.exports = function (arr) {
    var img0, img1, img2;

    if (arr && arr.length) { // 如果传入的有参数

        img0 = arr[0] || "none";
        img1 = arr[1] || "none";
        img2 = arr[2] || "none";

    } else { // 如果没有参数，则使用默认值
        img0 = defBase64[0];
        img1 = defBase64[1];
        img2 = defBase64[2];
    }

    img0 = img0.replace('url(none)', '');
    img1 = img1.replace('url(none)', '');
    img2 = img2.replace('url(none)', '');

    var content = `
    
/*css-background-start*/
[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(1) .overflow-guard>.monaco-scrollable-element{background-image: url(${img0});}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(3) .overflow-guard>.monaco-scrollable-element{background-image: url(${img1});}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(5) .overflow-guard>.monaco-scrollable-element{background-image: url(${img2});}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

[id='workbench.parts.editor']>.content>.one-editor-silo .overflow-guard>.monaco-scrollable-element{background-position:100% 100%;background-repeat:no-repeat;}
/*css-background-end*/
`;

    return content;
}