var extStyle = `
<style>
[id='workbench.parts.editor']>.content>.one-editor-container .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

[id='workbench.parts.editor']>.content>.one-editor-container:nth-child(1) .monaco-editor>.overflow-guard>.monaco-scrollable-element{background-image: url(http://i3.buimg.com/9d523a20ea864bc2.png);}

[id='workbench.parts.editor']>.content>.one-editor-container:nth-child(3) .monaco-editor>.overflow-guard>.monaco-scrollable-element{background-image: url(http://i3.buimg.com/1dd6b5d20c334350.png);}

[id='workbench.parts.editor']>.content>.one-editor-container:nth-child(5) .monaco-editor>.overflow-guard>.monaco-scrollable-element{background-image: url(http://i3.buimg.com/0ce7df680df89325.png);}

[id='workbench.parts.editor']>.content>.one-editor-container .monaco-editor>.overflow-guard>.monaco-scrollable-element{background-position:100% 100%;background-repeat:no-repeat;}
</style>
`;
var extDiv = document.createElement("div");
extDiv.innerHTML = extStyle;
document.body.appendChild(extDiv);
