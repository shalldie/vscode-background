# vscode-background

欢迎使用 `background@${VERSION}`，新版本拥有更多的功能，会给你带来更好的编码体验！

现在 `images` 支持了多系统格式的路径以及文件夹：

```json
{
  "images": [
    // 在线图片，只允许 `https` 协议
    "https://hostname/online.jpg",
    // 本地图片
    "file:///local/path/img.jpeg",
    "/home/xie/downloads/img.gif",
    "C:/Users/xie/img.bmp",
    "D:\\downloads\\images\\img.webp",
    // 文件夹
    "/home/xie/images",
    // data URL
    "data:image/*;base64,<base64-data>"
  ]
}
```

## 更多的可配置区域

每块区域都可以自定义 `图片/样式`、`轮播`、`随机展示` 等。

<img src="../images/containers.png" width="800" />

## 更清晰简洁的配置

每块区域对应独立配置，查看 [README.md](https://github.com/shalldie/vscode-background) 了解更多。

```json
{
  "background.sidebar": {...},     // 侧边栏
  "background.editor": {...},      // 编辑器
  "background.panel": {...},       // 面板
  "background.fullscreen": {...},  // 全屏
  "background.auxiliarybar": {...} // 辅助栏
}
```

## 快捷命令

点击状态栏右下角「Background」按钮，可以快速弹出 background 所有命令：

<img width="660" src="../images/commands.png">

## 治好强迫症

不再有令人厌烦的 `Code 安装似乎损坏` 提示 !!!

## 从 v1 迁移

> v1 的配置已经过时，需要进行迁移。当前保持一定的兼容性。

v1:

```json
{
  "background.useFront": true,
  "background.customImages": [],
  "background.interval": 0,
  "background.style": {},
  "background.styles": []
}
```

v2，迁移到 `background.editor`:

```json
{
  "background.editor": {
    "useFront": true,
    "images": [],
    ...
  }
}
```

## 想继续使用v1版本的默认图片？

可以从这里 [下载v1版本中的默认图片](https://github.com/shalldie/vscode-background/issues/106#issuecomment-392311967)，或者使用下方配置：

```json
{
  "background.editor": {
    "images": [
      "https://user-images.githubusercontent.com/9987486/40583669-d6189844-61c5-11e8-89e3-c52ad153da09.png",
      "https://user-images.githubusercontent.com/9987486/40583670-d6478c9e-61c5-11e8-9551-6b55eacc7b8d.png",
      "https://user-images.githubusercontent.com/9987486/40583671-d676c6e4-61c5-11e8-94cb-34ec4a12fa01.png"
    ]
  }
}
```
