# vscode-background

欢迎使用 `background@${VERSION}`，新版本拥有更多的功能，会给你带来更好的编码体验！

## 更多的可配置区域

每块区域都可以自定义 `图片/样式`、`轮播`、`随机展示`、`` 等。

<img src="../images/containers.png" width="800" />

## 更清晰简洁的配置

每块区域对应独立配置，查看 [README.md](https://github.com/shalldie/vscode-background) 了解更多。

```json
{
  "background.sidebar": {...},   // 侧边栏
  "background.editor": {...},    // 编辑器
  "background.panel": {...},     // 面板
  "background.fullscreen": {...} // 全屏
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
