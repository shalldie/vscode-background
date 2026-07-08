import fs from 'fs';
import path from 'path';

// 运行时读取 package.json
// 打包后运行于 dist/extension.js，__dirname 为 dist/，package.json 在其上一级
const pkg: { version: string; publisher: string; name: string } = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

/** 版本号 */
export const VERSION: string = pkg.version;

/** 版本标识 */
export const BACKGROUND_VER = 'background.ver';

/** 文件编码 */
export const ENCODING = 'utf-8';

/** 发布者 */
export const PUBLISHER: string = pkg.publisher;

/** 扩展名 */
export const EXTENSION_NAME: string = pkg.name;

/** 扩展ID */
export const EXTENSION_ID = `${PUBLISHER}.${EXTENSION_NAME}`;

/** 版本临时文件，存放 html 路径、标识初次安装 */
// 打包后运行于 dist/extension.js，__dirname 为 dist/
export const TOUCH_FILE_PATH = path.join(__dirname, `../vscb.${VERSION}.touch`);
