import defBase64 from './defBase64';
import version from './version';

/**
 * 生成css样式
 * 
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}|{}[]] 自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @returns 
 */
export default function (arr: Array<string>, style: {} | {}[], useFront = true) {
    let [img0, img1, img2] = (arr && arr.length) ?
        [encodeURI(arr[0] || 'none'),
        encodeURI(arr[1] || 'none'),
        encodeURI(arr[2] || 'none')] : defBase64;

    let styleArr1: string[] = [];
    let styleArr2: string[] = [];
    let styleArr3: string[] = [];

    let isArrayStyle: boolean = Array.isArray(style);
    if (isArrayStyle) {
        let arrLen = (<{}[]>style).length;        
        if (arrLen > 0) {            
            let inx: number = 0;
            for (let k in style[inx]) {
                // 在使用背景图时，排除掉 pointer-events
                if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
                    continue;
                }
        
                if (style[inx].hasOwnProperty(k)) {
                    styleArr1.push(`${k}:${style[inx][k]}`);
                }
            }

            inx++;
            inx = Math.min(arrLen - 1, inx);
            for (let k in style[inx]) {
                // 在使用背景图时，排除掉 pointer-events
                if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
                    continue;
                }
        
                if (style[inx].hasOwnProperty(k)) {
                    styleArr2.push(`${k}:${style[inx][k]}`);
                }
            }

            inx++;
            inx = Math.min(arrLen - 1, inx);
            for (let k in style[inx]) {
                // 在使用背景图时，排除掉 pointer-events
                if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
                    continue;
                }
        
                if (style[inx].hasOwnProperty(k)) {
                    styleArr3.push(`${k}:${style[inx][k]}`);
                }
            }
        }        
    } else {
        for (let k in style) {
            // 在使用背景图时，排除掉 pointer-events
            if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
                continue;
            }
    
            if (style.hasOwnProperty(k)) {
                styleArr1.push(`${k}:${style[k]}`);
            }
        }
        styleArr2 = styleArr1;
        styleArr3 = styleArr1;
    }

    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '::before';

    // 样式内容
    let styleContent1 = styleArr1.join(';') + ';';
    let styleContent2 = styleArr2.join(';') + ';';
    let styleContent3 = styleArr3.join(';') + ';';

    let content = `
    
/*css-background-start*/
/*background.ver.${version}*/
.editor-one>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img0}');${styleContent1}}

.editor-two>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img1}');${styleContent2}}

.editor-three>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img2}');${styleContent3}}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}