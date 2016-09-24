var defBase64 = require('./defBase64');

/**
 * 生成css样式
 */
module.exports = function (arr, randChoice) {
    var img0, img1, img2;

    (function (arr, randChoice) {
        var size = arr.length;
        var index = randChoice ? parseInt(size * Math.random()) : 0;
        img0 = arr[index++ % size] || "none";
        img1 = arr[index++ % size] || "none";
        img2 = arr[index++ % size] || "none";
    })((arr && arr.length && arr) || defBase64, randChoice);

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