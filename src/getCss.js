var defBase64 = require('./defBase64');
var version = require('./version');

/**
 * 生成css样式
 * 
 * @param {Array<string>} arr
 * @param {Object} style
 * @param {boolean} useFront
 * @returns {string}
 */
module.exports = function (arr, style, useFront) {
    style = style || {};
    let img0, img1, img2;

    if (arr && arr.length) { // 如果传入的有参数

        img0 = encodeURI(arr[0] || "none");
        img1 = encodeURI(arr[1] || "none");
        img2 = encodeURI(arr[2] || "none");

    } else { // 如果没有参数，则使用默认值
        img0 = defBase64[0];
        img1 = defBase64[1];
        img2 = defBase64[2];
    }

    let styleArr = [];
    for (let k in style) {
        // 在使用背景图时，排除掉 pointer-events
        if (!useFront && k == 'pointer-events') {
            continue;
        }

        if (style.hasOwnProperty(k)) {
            styleArr.push(`${k}:${style[k]}`);
        }
    }
    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '';

    // 样式内容
    let styleContent = styleArr.join(';') + ';';

    let content = `
    
/*css-background-start*/
/*background.ver.${version}*/
.editor-one>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img0}');${styleContent}}

.editor-two>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img1}');${styleContent}}

.editor-three>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img2}');${styleContent}}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}