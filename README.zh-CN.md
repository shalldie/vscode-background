<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md) | [Portugues](./README.pt-BR.md)

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](https://user-images.githubusercontent.com/9987486/40583704-6accf3a4-61c6-11e8-8c00-a636b9c3ec65.png)

<h1><b>vscode-background</b></h1>

### 给 [Visual Studio Code](https://code.visualstudio.com) 添加背景

`代码区域`、`全屏`、`轮播`、`自定义图片/样式`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/visual-studio-marketplace/v/shalldie.background?logo=visualstudiocode&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/workflow/status/shalldie/vscode-background/ci?label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

</div>

<!-- 封面区域 end -->

---

代码区域

<img width="880" src="https://user-images.githubusercontent.com/9987486/40583705-7105dda8-61c6-11e8-935a-3c5d475a1eb1.gif">

全屏

<img width="880" src="https://user-images.githubusercontent.com/9987486/198958380-6eaf96c7-3aa2-4fce-b27e-6f33c8d4e2c1.png">

## 安装

<!-- To install the extension just execute the following command in the Command Palette of Visual Studio Code -->

在命令选项板（command/ctl + p）中输入以下命令快速定位到插件：

```
ext install background
```

## 自定义

可以通过调整配置（in `settings.json`）来满足个性化需求。

[settings.json 是什么](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [怎么打开](https://github.com/shalldie/vscode-background/issues/274)

## 配置项

### 基础配置

| 名称                 |   类型    | 默认值 | 描述         |
| :------------------- | :-------: | :----: | :----------- |
| `background.enabled` | `Boolean` | `true` | 插件是否启用 |

### 默认配置

| 名称                      |      类型       |    默认值    | 描述                                              |
| :------------------------ | :-------------: | :----------: | :------------------------------------------------ |
| `background.useFront`     |    `Boolean`    |    `true`    | 前景图/背景图。 在代码上面还是下面                |
| `background.useDefault`   |    `Boolean`    |    `true`    | 是否使用默认图片                                  |
| `background.style`        |    `Object`     |     `{}`     | 自定义样式                                        |
| `background.styles`       | `Array<Object>` | `[{},{},{}]` | 每个图片的独立样式                                |
| `background.customImages` | `Array<String>` |     `[]`     | 自定义图片                                        |
| `background.loop`         |    `Boolean`    |   `false`    | 循环模式，会重复显示图片                          |
| `background.interval`     |    `Number`     |     `0`      | 设置图片轮播切换间隔 `秒` 数，默认 `0` 表示不开启 |

> `style` 指的是 [css style](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS)，通过自定义样式可以改变背景图的展示。

### 全屏配置

> 会覆盖默认配置

| 名称                    |   类型   | 默认值 | 描述         |
| :---------------------- | :------: | :----: | :----------- |
| `background.fullscreen` | `Object` | `null` | 设置全屏背景 |

example:

```json
{
  "background.fullscreen": {
    "image": "https://pathtoimage.png", // 图片的url
    // "image": ["https://pathtoimage.png"], // 当开启轮播图的时候，可以用数组配置多张图片
    "opacity": 0.91, // 建议值 0.85 ~ 0.95
    "size": "cover", // css, 建议使用 `cover`自适应，或者 `contain`、`200px 200px`
    "position": "center", // 同 `background-position`, 默认 `center`
    "interval": 0 // 设置图片轮播切换间隔 `秒` 数，默认 `0` 表示不开启
  }
}
```

## 一些示例

1. 关闭插件

```json
{
  "background.enabled": false
}
```

2. 自定义图片

**http** 协议的外链图片在当前版本不能使用(vscode 限制)，需要用 **https** 协议开头的外链地址。

```json
{
  "background.useDefault": false,
  "background.customImages": ["https://a.com/b.png", "file:///Users/somepath/a.jpg"]
}
```

3. 自定义样式 - 透明度

```json
{
  "background.style": {
    "opacity": 0.6
  }
}
```

4. 自定义样式 - 图片尺寸

```json
{
  "background.style": {
    "background-size": "300px 460px"
  }
}
```

5. 全屏

```json
{
  "background.fullscreen": {
    "image": "https://pathtoimage.png", // 图片的url
    // "image": ["https://pathtoimage.png"], // 当开启轮播图的时候，可以用数组配置多张图片
    "opacity": 0.91, // 建议值 0.85 ~ 0.95
    "size": "cover", // css, 建议使用 `cover`自适应，或者 `contain`、`200px 200px`
    "position": "center", // 同 `background-position`, 默认 `center`
    "interval": 0 // 单位 `秒`，轮播时候图片切换间隔，默认 `0` 表示不开启
  }
}
```

## 注意

> **本插件是通过修改 vscode 的 css 文件的方式运行**
>
> 所以会在初次安装，或者 vscode 升级的时候，出现以下提示，请选择 【不再提示】:

![](https://user-images.githubusercontent.com/9987486/40583926-b1fb5398-61ca-11e8-8271-4ac650d158d3.png)

原因：

![](https://user-images.githubusercontent.com/9987486/40583775-91d4c8d6-61c7-11e8-9048-8c5538a32399.png)

## 卸载

    三种方式

    方式1. (推荐)

    使用 `F1` 打开命令面板，输入并选择 `Background - Uninstall (remove extension)` ，完成自动化卸载。

    方式2.

    在 settings.json 中设置 {"background.enabled": false} ，然后再删除插件。

    方式3.（不推荐）

    如果直接删除了vscode，别担心。
    接着完全退出vscode，打开然后再次重启一遍，图片就没了，，，
    （我也知道挺奇怪，总之是因为vscode的限制 =。=）

## 感谢这些朋友的 pr 🙏

[<img alt="shalldie" src="https://avatars3.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
[<img alt="NoDocCat" src="https://avatars.githubusercontent.com/u/20502666?v=4" width="80">](https://github.com/NoDocCat)
[<img alt="frg2089" src="https://avatars.githubusercontent.com/u/42184238?v=4" width="80">](https://github.com/frg2089)
[<img alt="mwSora" src="https://avatars.githubusercontent.com/u/23083011?v=4" width="80">](https://github.com/mwSora)
[<img alt="tumit" src="https://avatars.githubusercontent.com/u/1756190?v=4" width="80">](https://github.com/tumit)
[<img alt="asurinsaka" src="https://avatars.githubusercontent.com/u/8145535?v=4" width="80">](https://github.com/asurinsaka)
[<img alt="u3u" src="https://avatars.githubusercontent.com/u/20062482?v=4" width="80">](https://github.com/u3u)
[<img alt="kuresaru" src="https://avatars.githubusercontent.com/u/31172177?v=4" width="80">](https://github.com/kuresaru)
[<img alt="Unthrottled" src="https://avatars.githubusercontent.com/u/15972415?v=4" width="80">](https://github.com/Unthrottled)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/15815422?v=4" width="80">](https://github.com/rogeraabbccdd)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/86603229?v=4" width="80">](https://github.com/SatoMasahiro2005)

## 更新日志

可以从 [这里](https://github.com/shalldie/vscode-background/blob/master/CHANGELOG.md) 查看所有的变更内容。

## Q&A

---

    Q: 怎么去除顶部的[不受信任]的标志（强迫症）？
    A: 参考另一个插件: https://github.com/lehni/vscode-fix-checksums

---

    Q: Mac 下安装完插件后，似乎没有反应？
    A:在 Mac 下，把 vscode 从 `下载` 移动到 `应用` 中

---

    Q: 插件基于修改 vscode css 文件运行，无权限时会尝试提权。
       如果因为某种原因不work了，用户需要自行改变权限怎么办呢？

    A: 在 windows 中，可以右键单击vscode的图标，选择【以管理员身份运行】。
    A: 在 mac/linux 中，请尝试：https://github.com/shalldie/vscode-background/issues/6

---

## 协议

MIT
