// sys
import fs from 'fs';

// libs
import vscode, { Disposable } from 'vscode';

// self
import { vsHelp } from '../utils/vsHelp';
import { ENCODE, TOUCH_FILE_PATH } from '../constants';
import { CssGenerator, TCssGeneratorOptions } from './CssGenerator';
import { utils } from '../utils';
import { CssFile, ECSSEditType } from './CssFile';
import { vscodePath } from '../utils/vscodePath';

/**
 * 配置类型
 */
type TConfigType = vscode.WorkspaceConfiguration & TCssGeneratorOptions;

/**
 * 插件逻辑类
 *
 * @export
 * @class Background
 */
export class Background implements Disposable {
    // #region fields 字段

    public cssFile = new CssFile(vscodePath.cssPath); // 没必要继承，组合就行

    /**
     * 当前用户配置
     *
     * @private
     * @type {TConfigType}
     * @memberof Background
     */
    private config: TConfigType = vscode.workspace.getConfiguration('background') as TConfigType;

    /**
     * 需要释放的资源
     *
     * @private
     * @type {Disposable[]}
     * @memberof Background
     */
    private disposables: Disposable[] = [];

    // #endregion

    // #region private methods 私有方法

    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private async checkFirstload(): Promise<boolean> {
        const firstLoad = !fs.existsSync(TOUCH_FILE_PATH);

        if (firstLoad) {
            // 提示
            vscode.commands.executeCommand('extension.background.info');
            // 标识插件已启动过
            await fs.promises.writeFile(TOUCH_FILE_PATH, vscodePath.cssPath, ENCODE);

            return true;
        }

        return false;
    }

    /**
     * 安装插件，hack css
     *
     * @private
     * @param {boolean} [refresh=false] 需要强制更新
     * @returns {void}
     * @memberof Background
     */
    private async install(refresh = false): Promise<void> {
        const lastConfig = this.config; // 之前的配置
        const config = vscode.workspace.getConfiguration('background') as TConfigType; // 当前用户配置

        // 1.如果配置文件改变的时候，当前插件配置没有改变，则返回
        if (!refresh && JSON.stringify(lastConfig) == JSON.stringify(config)) {
            // console.log('配置文件未改变.')
            return;
        }

        // 之后操作有两种：1.初次加载  2.配置文件改变

        // 2.两次配置均为，未启动插件
        if (!lastConfig.enabled && !config.enabled) {
            // console.log('两次配置均为，未启动插件');
            return;
        }

        // 3.保存当前配置
        this.config = config; // 更新配置

        // 4.如果关闭插件
        if (!config.enabled) {
            await this.uninstall();
            vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
            return;
        }

        // 5.应用配置到css文件
        try {
            // 该动作需要加锁，涉及多次文件读写
            await utils.lock();

            const content = (await CssGenerator.create(config)).trimEnd(); // 去除末尾空白

            // 添加到原有样式(尝试删除旧样式)中
            let cssContent = await this.cssFile.getContent();
            cssContent = this.cssFile.clearContent(cssContent);
            // 异常case return
            if (!cssContent.trim().length) {
                return;
            }
            cssContent += content;

            if (await this.cssFile.saveContent(cssContent)) {
                vsHelp.showInfoRestart('Background has been changed! Please restart.');
            }
        } finally {
            await utils.unlock();
        }
    }

    // #endregion

    // #region public methods

    /**
     * 初始化
     *
     * @return {*}  {Promise<void>}
     * @memberof Background
     */
    public async setup(): Promise<void> {
        const firstload = await this.checkFirstload(); // 是否初次加载插件

        const editType = await this.cssFile.getEditType(); // css 文件目前状态

        // 如果是第一次加载插件，或者旧版本
        if (firstload || editType == ECSSEditType.IsOld || editType == ECSSEditType.NoModified) {
            await this.install(true);
        }

        // 监听文件改变
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(async () => {
                // 0~500ms 的延时，对于可能的多实例，错开对于文件的操作
                // 虽然有锁了，但这样更安心 =。=
                await utils.sleep(~~(Math.random() * 500));
                this.install();
            })
        );
    }

    /**
     * 是否已安装
     *
     * @return {*}
     * @memberof Background
     */
    public hasInstalled(): Promise<boolean> {
        return this.cssFile.hasInstalled();
    }

    /**
     * 卸载
     *
     * @return {*}  {Promise<boolean>} 是否成功卸载
     * @memberof Background
     */
    public uninstall(): Promise<boolean> {
        return this.cssFile.uninstall();
    }

    /**
     * 释放资源
     *
     * @memberof Background
     */
    public dispose(): void {
        this.disposables.forEach(n => n.dispose());
    }

    // #endregion
}
