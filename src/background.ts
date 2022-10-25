// sys
import os from 'os';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// libs
import vscode from 'vscode';
import { sudo } from './sudo';
// self
import * as vsHelp from './vsHelp';
import { vscodePath } from './vscodePath';
import { getCss } from './getCss';
import { VERSION, BACKGROUND_VER, ENCODE, EXTENSION_ID } from './constants';

/**
 * css文件修改状态类型
 *
 * @enum {number}
 */
export enum ECSSEditType {
    /**
     * 未修改的css文件
     */
    noModified,
    /**
     * hack 过的旧版本css文件
     */
    isOld,
    /**
     * hack 过的新版本的css文件
     */
    isNew
}

// 插件逻辑

const _getExtensionConfig = () => vscode.workspace.getConfiguration('background');

/**
 * 当前用户配置
 */
let _config = _getExtensionConfig();

/**
 * 获取当前 css 文件的修改类型
 */
export const getFileType = async (css: string) => {
    if (!hasInstalled(css)) {
        return ECSSEditType.noModified;
    }

    // hack 过的旧版本，即不包含当前版本
    const ifVerOld = !~css.indexOf(`/*${BACKGROUND_VER}.${VERSION}*/`);

    if (ifVerOld) {
        return ECSSEditType.isOld;
    }

    // hack 过的新版本
    return ECSSEditType.isNew;
};

/**
 * 获取 css 文件内容
 * @returns css 文件内容
 */
export const getCssContent = () => fs.readFile(vscodePath.cssPath, ENCODE);

/**
 * 设置 css 文件内容
 * @param content 设置 css 文件内容
 */
const _autoSave = async (content: string) => {
    // 添加到原有样式(尝试删除旧样式)中
    const css = await getCssContent()
        .then(_cleanCss)
        .then(css => css + content);

    // 如果是 null | undefined | '' 则立刻停止保存
    // 这会导致VSCode损坏
    if (!css) return;
    try {
        await fs.writeFile(vscodePath.cssPath, css, ENCODE);
    } catch (error) {
        if (error.code !== 'EPERM') throw error;
        if (!(await vsHelp.sudo())) return;

        // FIXME：
        // 一些系统会报错：Unable to find pkexec or kdesudo.
        // 相关 issue：https://github.com/jorangreef/sudo-prompt/pull/123
        // 测试环境： codercom/code-server:4.4.0
        // uname -a
        // Linux code-server-b6cc684df-sqx9h 5.4.0-77-generic #86-Ubuntu SMP Thu Jun 17 02:35:03 UTC 2021 x86_64 GNU/Linux
        const tempFilePath = path.join(os.tmpdir(), `${EXTENSION_ID}-${crypto.randomUUID()}`);

        const mvcmd = process.platform === 'win32' ? 'move /Y' : 'mv -f';
        await fs
            .writeFile(tempFilePath, content, ENCODE)
            .then(() =>
                sudo(`${mvcmd} "${tempFilePath}" "${vscodePath.cssPath}"`, {
                    name: 'Visual Studio Code Background Extension'
                })
            )
            .finally(() => fs.rm(tempFilePath, { force: true }));
    }

    // 修改成功 重启生效
    await vsHelp.restartOnChanged();
};

/**
 * 检测是否初次加载，并在初次加载的时候提示用户
 *
 * @returns 是否初次加载
 */
export const checkFirstload = () => {
    const versionTouchFile = path.join(__dirname, `../vscb.${VERSION}.touch`);

    const firstLoad = !existsSync(versionTouchFile);

    if (!firstLoad) return false;

    // 提示
    vsHelp.welcome();

    // 标识插件已启动过
    fs.writeFile(versionTouchFile, '', ENCODE);

    return true;
};

/**
 * 安装插件，hack css
 *
 * @param refresh 需要强制更新
 */
export const install = async (refresh?: boolean): Promise<void> => {
    const config = _getExtensionConfig(); // 当前用户配置

    // 1.如果配置文件改变的时候，当前插件配置没有改变，则返回
    if (!refresh && JSON.stringify(_config) == JSON.stringify(config)) {
        // console.log('配置文件未改变.')
        return;
    }

    // 之后操作有两种：1.初次加载  2.配置文件改变

    // 2.两次配置均为，未启动插件
    if (!_config.enabled && !config.enabled) {
        // console.log('两次配置均为，未启动插件');
        return;
    }

    // 3.保存当前配置
    _config = config; // 更新配置

    // 4.如果关闭插件
    if (!config.enabled) {
        await uninstall();
        return;
    }

    // 5.hack 样式

    // 自定义的样式内容
    await getCss(config as any).then(_autoSave);
};

/**
 * 清理css中的添加项
 * @param content 将要清理的css
 * @returns 移除扩展添加的内容的css
 */
const _cleanCss = (content: string) =>
    content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '').trim();

/**
 * 是否已经安装过
 */
export const hasInstalled = (css: string) => css && !!~css.indexOf(BACKGROUND_VER);

/**
 * 卸载
 */
export const uninstall = (hidePrompt?: boolean) =>
    _autoSave('')
        .then(() => {
            if (!hidePrompt) vsHelp.restartOnUninstalled();
        })
        .catch(console.log);
