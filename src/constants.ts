import path from 'path';
import pkg from '../package.json';

/** 版本号 */
export const VERSION: string = pkg.version;

/** 版本标识 */
export const BACKGROUND_VER = 'background.ver';

/** 文件编码 */
export const ENCODE = 'utf-8';

/** 发布者 */
export const PUBLISHER: string = pkg.publisher;

/** 扩展名 */
export const EXTENSION_NAME: string = pkg.name;

/** 扩展ID */
export const EXTENSION_ID = `${PUBLISHER}.${EXTENSION_NAME}`;

/** 文件锁路径 */
export const LOCK_PATH = path.join(__dirname, '../', `${EXTENSION_ID}.lock`);
