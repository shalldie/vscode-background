import * as path from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';

import vsHelp from './vsHelp';
import vscodePath from './vscodePath';
import version from './version';
import getCss from './getCss';

/**
 * 文件类型
 * 
 * @enum {number}
 */
enum FileType {
    /**
     * 未修改的css文件
     */
    empty,
    /**
     * hack 过的旧版本css文件
     */
    isOld,
    /**
     * hack 过的新版本的css文件
     */
    isNew
}

/**
 * 插件逻辑类
 * 
 * @export
 * @class Background
 */
class Background {

    //#region private fields 私有字段

    /**
     * 当前用户配置
     * 
     * @private
     * @type {*}
     * @memberof Background
     */
    private config: any = vscode.workspace.getConfiguration('background');

    //#endregion

    //#region private methods 私有方法

    /**
     * 获取 css 文件内容
     * 
     * @private
     * @returns {string} 
     * @memberof Background
     */
    private getCssContent(): string {
        return fs.readFileSync(vscodePath.cssPath, 'utf-8');
    }

    /**
     * 设置 css 文件内容
     * 
     * @private
     * @param {string} content 
     * @memberof Background
     */
    private saveCssContent(content: string): void {
        fs.writeFileSync(vscodePath.cssPath, content, 'utf-8');
    }


    /**
     * 初始化
     * 
     * @private
     * @memberof Background
     */
    private initialize(): void {

        let firstload = this.checkFirstload();  // 是否初次加载插件

        let fileType = this.getFileType(); // css 文件目前状态

        // 如果是第一次加载插件，或者旧版本
        if (firstload || fileType == FileType.isOld || fileType == FileType.empty) {
            this.install(true);
        }

    }

    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     * 
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private checkFirstload(): boolean {
        const configPath = path.join(__dirname, '../assets/config.json');
        let info: { firstload: boolean } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        if (info.firstload) {
            // 提示
            vsHelp.showInfo('Welcome to use background! U can config it in settings.json.')
            // 标识插件已启动过
            info.firstload = false;
            fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');

            return true;
        }

        return false;
    }

    /**
     * 获取css文件状态
     * 
     * @private
     * @returns {FileType} 
     * @memberof Background
     */
    private getFileType(): FileType {
        let cssContent = this.getCssContent();

        // 未 hack 过
        let ifUnInstall: boolean = !~cssContent.indexOf(`background.ver`);

        if (ifUnInstall) {
            return FileType.empty;
        }

        // hack 过的旧版本
        let ifVerOld: boolean = !~cssContent.indexOf(`/*background.ver.${version}*/`);

        if (ifVerOld) {
            fs.writeFileSync(path.join(__dirname, '../xxx.css'), cssContent, 'utf-8');
            return FileType.isOld;
        }

        // hack 过的新版本
        return FileType.isNew;
    }

    /**
     * 安装插件，hack css
     * 
     * @private
     * @param {boolean} [refresh] 需要更新
     * @returns {void} 
     * @memberof Background
     */
    private install(refresh?: boolean): void {

        let lastConfig = this.config;  // 之前的配置
        let config = vscode.workspace.getConfiguration('background'); // 当前用户配置

        // 1.如果配置文件改变到时候，当前插件配置没有改变，则返回
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
            this.uninstall();
            vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
            return;
        }

        // 5.hack 样式
        let arr = []; // 默认图片

        if (!config.useDefault) { // 自定义图片
            //arr = config.customImages;
            arr = this.getImageList();
        }

        // 自定义的样式内容
        let content = getCss(arr, config.style, config.styles, config.useFront).replace(/\s*$/, ''); // 去除末尾空白

        // 添加到原有样式(尝试删除旧样式)中
        let cssContent = this.getCssContent();
        cssContent = this.clearCssContent(cssContent);
        cssContent += content;

        this.saveCssContent(cssContent);
        vsHelp.showInfoRestart('Background has been changed! Please restart.');

    }

    /**
     * 卸载
     * 
     * @private
     * @memberof Background
     */
    private uninstall(): boolean {
        try {
            let content = this.getCssContent();
            content = this.clearCssContent(content);
            this.saveCssContent(content);
            return true;
        }
        catch (ex) {
            console.log(ex);
            return false;
        }
    }

    /**
     * 清理css中的添加项
     * 
     * @private
     * @param {string} content 
     * @returns {string} 
     * @memberof Background
     */
    private clearCssContent(content: string): string {
        content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
    /**
     * get and random order images
     *
     * @private
     * @returns {array}
     * @memberof Background
     */
    private getImageList(): string[] {
        let config = this.config;
        let folders:string[] = config.customImageFolders;
        let arr:string[] = [];
        if(folders.length > 0){
            let fdpath:string = folders[Math.floor( Math.random() * folders.length )];
            let files:string[] = fs.readdirSync(path.resolve(fdpath));
            files.filter((s) => {
                return s.endsWith('.png') || s.endsWith('.jpg') || s.endsWith('.gif');
            }).forEach((file) => {
                arr.push( path.join(fdpath,file).toString().replace(/\\/g,'/') ) ;
            });
        }else{
            arr = config.customImages;
        }
        if(config.useRandom){ 
            for(let i:number = arr.length - 1; i > 0; i--){
                let r:number = Math.floor(Math.random() * (i + 1));
                let tmp = arr[i];
                arr[i] = arr[r];
                arr[r] = tmp;
            }
        }
        return arr;
    }
    //#endregion

    //#region public methods

    /**
     * 初始化，并开始监听配置文件改变
     * 
     * @returns {vscode.Disposable} 
     * @memberof Background
     */
    public watch(): vscode.Disposable {
        this.initialize();
        return vscode.workspace.onDidChangeConfiguration(() => this.install());
    }

    //#endregion
}

export default new Background();
