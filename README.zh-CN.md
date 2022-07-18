# vscode-background

[![Version](https://vsmarketplacebadge.apphb.com/version/shalldie.background.svg?style=flat-square&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/shalldie.background.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/shalldie.background.svg?style=flat-square)](https://vsmarketplacebadge.apphb.com/rating/shalldie.background.svg)
[![Build Status](https://img.shields.io/github/workflow/status/shalldie/vscode-background/ci?label=build&logo=github&style=flat-square)](https://github.com/shalldie/vscode-background/actions)

[English](./README.md) | [中文](./README.zh-CN.md)

[GitHub](https://github.com/shalldie/vscode-background) | [Vscode Market](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

---

<!-- Bring icons to your Visual Studio Code -->

给 [Visual Studio Code](https://code.visualstudio.com) 添加背景

![](https://user-images.githubusercontent.com/9987486/40583705-7105dda8-61c6-11e8-935a-3c5d475a1eb1.gif)

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

| 名称                      |      类型       |    默认值    | 描述                               |
| :------------------------ | :-------------: | :----------: | :--------------------------------- |
| `background.enabled`      |    `Boolean`    |    `true`    | 插件是否启用                       |
| `background.useFront`     |    `Boolean`    |    `true`    | 前景图/背景图。 在代码上面还是下面 |
| `background.useDefault`   |    `Boolean`    |    `true`    | 是否使用默认图片                   |
| `background.style`        |    `Object`     |     `{}`     | 自定义样式                         |
| `background.styles`       | `Array<Object>` | `[{},{},{}]` | 每个图片的独立样式                 |
| `background.customImages` | `Array<String>` |     `[]`     | 自定义图片                         |
| `background.loop`         |    `Boolean`    |   `false`    | 循环模式，会重复显示图片           |

`style` 指的是 [css style](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS)，通过自定义样式可以改变背景图的展示。

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

5. 自定义样式 - 全屏

[Related Issue](https://github.com/shalldie/vscode-background/issues/268)

```json
{
  "background.style": {
    "background-size": "cover",
    "position": "fixed"
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

    两种方式

    方式1. (推荐)

    使用 `F1` 打开命令面板，输入并选择 `Background - Uninstall (remove extension)` ，完成自动化卸载。

    方式2.

    在 settings.json 中设置 {"background.enabled": false} ，然后再删除插件。

## 感谢这些朋友的 pr 🙏

[<img alt="shalldie" src="https://avatars3.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
[<img alt="NoDocCat" src="https://avatars.githubusercontent.com/u/20502666?v=4" width="80">](https://github.com/NoDocCat)
[<img alt="frg2089" src="https://avatars.githubusercontent.com/u/42184238?v=4" width="80">](https://github.com/frg2089)
[<img alt="mwSora" src="https://avatars.githubusercontent.com/u/23083011?v=4" width="80">](https://github.com/mwSora)
[<img alt="tumit" src="https://avatars.githubusercontent.com/u/1756190?v=4" width="80">](https://github.com/tumit)
[<img alt="asurinsaka" src="https://avatars.githubusercontent.com/u/8145535?v=4" width="80">](https://github.com/asurinsaka)
[<img alt="u3u" src="https://avatars.githubusercontent.com/u/20062482?v=4" width="80">](https://github.com/u3u)
[<img alt="Unthrottled" src="https://avatars.githubusercontent.com/u/15972415?v=4" width="80">](https://github.com/Unthrottled)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/15815422?v=4" width="80">](https://github.com/rogeraabbccdd)

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

## 协议

MIT
