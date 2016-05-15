var extStyle = `
<style>
.vscode-theme-defaults-themes-dark_plus-json>.overflow-guard>.vscode-theme-defaults-themes-dark_plus-json.vs-dark>.monaco-editor-background{background: none;}

.monaco-editor-background>.content>.one-editor-container:nth-of-type(1) .vscode-theme-defaults-themes-dark_plus-json>.overflow-guard>.vscode-theme-defaults-themes-dark_plus-json.vs-dark{background-image: url(http://i3.buimg.com/9d523a20ea864bc2.png);}

.monaco-editor-background>.content>.one-editor-container:nth-of-type(3) .vscode-theme-defaults-themes-dark_plus-json>.overflow-guard>.vscode-theme-defaults-themes-dark_plus-json.vs-dark{background-image: url(http://i3.buimg.com/1dd6b5d20c334350.png);}

.monaco-editor-background>.content>.one-editor-container:nth-of-type(5) .vscode-theme-defaults-themes-dark_plus-json>.overflow-guard>.vscode-theme-defaults-themes-dark_plus-json.vs-dark{background-image: url(http://i3.buimg.com/0ce7df680df89325.png);}

.monaco-editor-background>.content>.one-editor-container .vscode-theme-defaults-themes-dark_plus-json>.overflow-guard>.vscode-theme-defaults-themes-dark_plus-json.vs-dark{background-position:100% 100%;background-repeat:no-repeat;}
</style>
`;
var extDiv = document.createElement("div");
extDiv.innerHTML = extStyle;
document.body.appendChild(extDiv);
