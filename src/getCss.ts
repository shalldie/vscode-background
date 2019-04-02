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
 * @returns
 */
export default function (arr: Array<string>, style = {}, styles = [], useFront = true) {
    let img0, img1, img2;
    // 根据用户设置的背景图，填充满三个，不够则使用默认的图片。
    if (arr && arr.length) {
        const arrImage = [
          [encodeURI(arr[0] || 'none'), defBase64[0], defBase64[1]],
          [encodeURI(arr[0] || 'none'), encodeURI(arr[1] || 'none'), defBase64[0]],
          [encodeURI(arr[0] || 'none'), encodeURI(arr[1] || 'none'), encodeURI(arr[2] || 'none')],
        ];
        [img0, img1, img2] = arrImage[arr.length - 1];
    } else {
        [img0, img1, img2] = defBase64;
    }

    let defStyle = getStyleByOptions(style, useFront); // 默认样式
    let [style0, style1, style2] = [                   // 3个子项样式
        defStyle + getStyleByOptions(styles[0], useFront),
        defStyle + getStyleByOptions(styles[1], useFront),
        defStyle + getStyleByOptions(styles[2], useFront)
    ];

    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '::before';

    let content = `

/*css-background-start*/
/*background.ver.${version}*/

[id="workbench.parts.editor"] .split-view-view:nth-child(1) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img0}');${style0}}

[id="workbench.parts.editor"] .split-view-view:nth-child(2) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img1}');${style1}}

[id="workbench.parts.editor"] .split-view-view:nth-child(3) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img2}');${style2}}

[id="workbench.parts.editor"] .split-view-view .editor-container .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

/*css-background-end*/
`;

    return content;
}
