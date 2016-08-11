var extStyle = `
<style>

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(1) .overflow-guard>.monaco-scrollable-element{background-image: url();}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(3) .overflow-guard>.monaco-scrollable-element{background-image: url();}

[id='workbench.parts.editor']>.content>.one-editor-silo:nth-child(5) .overflow-guard>.monaco-scrollable-element{background-image: url();}

[id='workbench.parts.editor']>.content>.one-editor-silo .monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

[id='workbench.parts.editor']>.content>.one-editor-silo .overflow-guard>.monaco-scrollable-element{background-position:100% 100%;background-repeat:no-repeat;}
</style>
`;
var extDiv = document.createElement("div");
extDiv.innerHTML = extStyle;
document.body.appendChild(extDiv);