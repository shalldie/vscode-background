var fs = require('fs');
var path = require('path');

var vscode = require('vscode');

var getCss = require('./getCss'); // css template
var vscodePath = require('./vscodePath'); // 路径文件
var version = require('./version'); // 版本
var vsHelp = require('./vsHelp'); // vsHelp 辅助类

/**
 * 主流程控制类
 * 
 * @class Background
 */
class Background {

    /**
     * Creates an instance of Background.
     * 
     * 
     * @memberOf Background
     */
    constructor() {
        this.init();
    }


    /**
     *  初始化
     * 
     * 
     * @memberOf Background
     */
    init() {
        var firstLoad = this.firstLoad(); // 检查是否刚刚安装

        var ifOld = this.removeOld(); // 是否存在过时文件，或者样式表中无数据

        var config = vscode.workspace.getConfiguration('background'); // 用户配置

        this.lastConfig = config; // 当前的配置

        if (firstLoad || ifOld) { // 第一次默认安装，如果样式表无数据也进行安装检测
            this.install(true);
        }


        // 监测配置文件
        var subscriptions = [];

        vscode.workspace.onDidChangeConfiguration(this.install, this, subscriptions);

        this.disposable = vscode.Disposable.from(subscriptions);


    }

    /**
     * 是否刚刚安装background插件
     * 
     * @returns boolean
     * 
     * @memberOf Background
     */
    firstLoad() {
        var configPath = path.join(__dirname, 'config', 'config.json');
        var info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (info.firstload) {
            // var hasOld = this.removeOld();
            // var content = hasOld ? 'Ver. old uninstalled. ' : '';

            vsHelp.showInfo('Welcome to use background! U can config it in settings.json.');
            info.firstload = false;
            fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');

            return true;
        }

        return false;
    }

    /**
     * 移除旧版本
     * 
     * @returns 是否存在旧版本，或者未安装
     * 
     * @memberOf Background
     */
    removeOld() {
        var cssContent = fs.readFileSync(vscodePath.cssPath, 'utf-8'); // css 文件内容

        var ifVerOld = !~cssContent.indexOf(`background.ver.${version}`); // 版本是否过时

        if (ifVerOld) { // 如果版本过时，则卸载
            this.uninstall();
            console.log('删除旧版本');
            return true;
        }
        return false;
    }


    /**
     * 安装背景图
     * 
     * 
     * @memberOf Background
     */
    install(firstload) {
        var lastConfig = this.lastConfig; // 之前的配置
        var config = vscode.workspace.getConfiguration('background'); // 用户配置

        // 如果配置文件改变到时候，当前插件配置没有改变，则返回
        if (!firstload && JSON.stringify(lastConfig) == JSON.stringify(config)) {
            console.log('配置文件未改变.')
            return;
        }

        // 之后到操作有两种：1.初次加载  2.配置文件改变 

        if (!lastConfig.enabled && !config.enabled) { // 如果此时仍然为未启用状态，只是修改图片路径
            return;
        }

        this.lastConfig = config; // 更新最新配置

        if (!config.enabled) { // 关闭插件
            this.uninstall();
            vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
            return;
        }

        var arr = []; // 默认图片		
        var size = [];
        if (!config.useDefault) { // 自定义图片
            arr = config.customImages;
            size = config.size;
        }

        var opacity = config.opacityImages;
        var size = config.size;

        var content = getCss(arr, opacity, size).replace(/\s*$/, ''); // 去除末尾空白

        var cssContent = fs.readFileSync(vscodePath.cssPath, 'utf-8') + content;

        fs.writeFileSync(vscodePath.cssPath, cssContent, 'utf-8');
        vsHelp.showInfoRestart('Background has been changed! Please restart.');
    }

    /**
     * 卸载背景图
     * 
     * 
     * @memberOf Background
     */
    uninstall() {
        var content = fs.readFileSync(vscodePath.cssPath, 'utf-8');
        content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        fs.writeFileSync(vscodePath.cssPath, content, 'utf-8');
    }
}

module.exports = Background;