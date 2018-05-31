import defBase64 from './defBase64';
import version from './version';

/**
 * 通过配置获取样式文本
 * 
 * @param {object} options 用户配置
 * @param {boolean} useFront 是否前景图
 * @returns {string}
 */
function getStyleByOptions(options: object, useFront: boolean) {
    let styleArr: string[] = [];
    for (let k in options) {
        // 在使用背景图时，排除掉 pointer-events
        if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
            continue;
        }

        if (options.hasOwnProperty(k)) {
            styleArr.push(`${k}:${options[k]}`);
        }
    }
    return styleArr.join(';') + ';';
}

/**
 * 生成css样式
 * 
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}] 自定义样式
 * @param {Array<any>} [styles=[]] 每个背景图的自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @param {boolean} [random=true] 是否随机顺序
 * @returns 
 */
export default function (config: any) {
    let { style = {}, styles = [], useFront = true, useDefault, customImages, random } = config;

    let arr = useDefault ? defBase64 : customImages;
    let pick = random ? (() => {
        let samples = new Array(arr.length).fill(null).map((_, i) => i).sort(() => 0.5 - Math.random());
        return (arr, i) => arr[samples[i]];
    })() : i => i;

    let [img0, img1, img2] = [
        encodeURI(pick(arr, 0) || 'none'),
        encodeURI(pick(arr, 1) || 'none'),
        encodeURI(pick(arr, 2) || 'none'),
    ];

    let defStyle = getStyleByOptions(style, useFront); // 默认样式
    let [styel0, style1, style2] = [                   // 3个子项样式
        defStyle + getStyleByOptions(pick(styles, 0), useFront),
        defStyle + getStyleByOptions(pick(styles, 1), useFront),
        defStyle + getStyleByOptions(pick(styles, 2), useFront)
    ];

    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '::before';

    let content = `
    
/*css-background-start*/
/*background.ver.${version}*/
.editor-one>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img0}');${styel0}}

.editor-two>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img1}');${style1}}

.editor-three>.container>.editor-container>.monaco-editor>.overflow-guard>.monaco-scrollable-element:nth-child(2)${frontContent}{background-image: url('${img2}');${style2}}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}
