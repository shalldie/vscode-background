"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");

// 文件路径
const base = process.cwd();
const filePath = path.join(base, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.main.css');


//执行清理操作
try {
	var content = getContent();
	content = clearCssContent(content);
	saveContent(content);
	return true;
}catch (ex) {
	return false;
}


/**
 * 获取文件内容
 * @var mixed
 */
function getContent() {
	return fs.readFileSync(filePath, 'utf-8');
}
/**
 * 设置文件内容
 *
 * @private
 * @param {string} content
 */
function saveContent(content) {
	fs.writeFileSync(filePath, content, 'utf-8');
}
/**
 * 清理已经添加的代码
 *
 * @private
 * @param {string} content
 * @returns {string}
 */
function clearCssContent(content) {
	content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
	content = content.replace(/\s*$/, '');
	return content;
}


//node D:\code\TypeScript\vscode-background-cover\resources\uninstall.js