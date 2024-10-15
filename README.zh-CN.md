<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md) | [Portugues](./README.pt-BR.md)

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](images/logo.png)

<h1><b>vscode-background</b></h1>

### 给 [Visual Studio Code](https://code.visualstudio.com) 添加背景

`全屏`、`编辑器`、`侧边栏`、`面板`、`轮播`、`自定义图片/样式`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/visual-studio-marketplace/v/shalldie.background?logo=visualstudiocode&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shalldie/vscode-background/ci.yml?branch=master&label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

多区域，`editor`、`sidebar`、`panel`

<img width="760" src="images/section.png">

全屏

<img width="760" src="images/fullscreen.png">

</div>

<!-- 封面区域 end -->

## 安装

<!-- To install the extension just execute the following command in the Command Palette of Visual Studio Code -->

1. 从 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background) 安装
2. 在 vscode 里搜索 `shalldie.background`

## 自定义

可以通过调整配置（in `settings.json`）来满足个性化需求。

[settings.json 是什么](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [怎么打开](https://github.com/shalldie/vscode-background/issues/274)

## 配置项

<img width="760" src="images/containers.png">

### 全局配置

| 名称                 |   类型    | 默认值 | 描述         |
| :------------------- | :-------: | :----: | :----------- |
| `background.enabled` | `Boolean` | `true` | 插件是否启用 |

### 自定义背景图

editor:

```json
{
  "background.editor": {
    "useFront": true, // 前景图/背景图。 在代码上面还是下面
    // 自定义样式，通过自定义样式可以改变背景图的展示。
    "style": {
      "background-position": "100% 100%",
      "background-size": "auto",
      "opacity": 1
    },
    "styles": [{}, {}, {}], // 每个图片的独立样式
    // 自定义图片地址，仅支持 https 和 file 协议
    "images": ["https://pathtoimage.png", "file:///path/to/local/file"],
    "interval": 0, // 设置图片轮播切换间隔 `秒` 数，默认 `0` 表示不开启
    "random": false // 是否随机展示图片
  }
}
```

全屏-fullscreen、侧边栏-sidebar、面板-panel：

```json
{
  "background.fullscreen": {
    // 自定义图片地址，仅支持 https 和 file 协议
    "images": ["https://pathtoimage.png", "file:///path/to/local/file"],
    "opacity": 0.91, // 建议值 0.85 ~ 0.95
    "size": "cover", // css, 建议使用 `cover`自适应，或者 `contain`、`200px 200px`
    "position": "center", // 同 `background-position`, 默认 `center`
    "interval": 0, // 设置图片轮播切换间隔 `秒` 数，默认 `0` 表示不开启
    "random": false // 是否随机展示图片，默认 `false`
  },
  // `sidebar`、`panel` 的配置与 `fullscreen` 一致
  "background.sidebar": {},
  "background.panel": {}
}
```

## 快捷命令

点击状态栏右下角「Background」按钮，可以快速弹出 background 所有命令：

<img width="660" src="images/commands.png">

## 注意

> **本插件是通过修改 vscode 的 js 文件的方式运行**
>
> 所以会在初次安装，或者 vscode 升级的时候，出现以下提示，请选择 【不再提示】:

<img width="560" src="https://user-images.githubusercontent.com/9987486/40583926-b1fb5398-61ca-11e8-8271-4ac650d158d3.png">

原因：

<img width="560" src="https://user-images.githubusercontent.com/9987486/40583775-91d4c8d6-61c7-11e8-9048-8c5538a32399.png">

## 卸载

    三种方式

    方式1. (推荐)

    点击状态栏右下角「Background」按钮，选择「卸载插件」，完成自动化卸载。

    方式2.

    在 settings.json 中设置 {"background.enabled": false} ，然后再删除插件。

    方式3.（不推荐）

    如果直接删除了vscode，别担心。
    接着完全退出vscode，打开然后再次重启一遍，图片就没了，，，
    （我也知道挺奇怪，总之是因为vscode的限制 =。=）

## 感谢这些朋友的 pr 🙏

[<img alt="shalldie" src="https://avatars3.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
[<img alt="suiyun39" src="https://avatars.githubusercontent.com/u/20502666?v=4" width="80">](https://github.com/suiyun39)
[<img alt="frg2089" src="https://avatars.githubusercontent.com/u/42184238?v=4" width="80">](https://github.com/frg2089)
[<img alt="AzureeDev" src="https://avatars.githubusercontent.com/u/23083011?v=4" width="80">](https://github.com/AzureeDev)
[<img alt="tumit" src="https://avatars.githubusercontent.com/u/1756190?v=4" width="80">](https://github.com/tumit)
[<img alt="asurinsaka" src="https://avatars.githubusercontent.com/u/8145535?v=4" width="80">](https://github.com/asurinsaka)
[<img alt="u3u" src="https://avatars.githubusercontent.com/u/20062482?v=4" width="80">](https://github.com/u3u)
[<img alt="kuresaru" src="https://avatars.githubusercontent.com/u/31172177?v=4" width="80">](https://github.com/kuresaru)
[<img alt="Unthrottled" src="https://avatars.githubusercontent.com/u/15972415?v=4" width="80">](https://github.com/Unthrottled)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/15815422?v=4" width="80">](https://github.com/rogeraabbccdd)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/86603229?v=4" width="80">](https://github.com/SatoMasahiro2005)

## 更新日志

可以从 [这里](https://github.com/shalldie/vscode-background/blob/master/CHANGELOG.md) 查看所有的变更内容。

## 高频问题导航

可以从 [这里](https://github.com/shalldie/vscode-background/issues/352) 查看高频率遇到的问题汇总。

## 协议

MIT
