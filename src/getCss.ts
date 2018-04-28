import defBase64 from './defBase64';
import version from './version';

/**
 * 生成css样式
 * 
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}] 自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @returns 
 */
export default function (arr: Array<string>, style = {}, useFront = true) {
    let [img0, img1, img2] = (arr && arr.length) ?
        [encodeURI(arr[0] || 'none'),
        encodeURI(arr[1] || 'none'),
        encodeURI(arr[2] || 'none')] : defBase64;

    let styleArr: string[] = [];

    for (let k in style) {
        // 在使用背景图时，排除掉 pointer-events
        if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
            continue;
        }

        if (style.hasOwnProperty(k)) {
            styleArr.push(`${k}:${style[k]}`);
        }
    }

    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '::before';

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