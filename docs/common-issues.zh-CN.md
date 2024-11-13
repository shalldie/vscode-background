# 常见问题

[English](./common-issues.md) | [中文](./common-issues.zh-CN.md)

## 插件是如何工作的

**本插件是通过修改 vscode 的 js 文件的方式运行**

## 如何获取本地图片地址

可以把图片拖到浏览器中，然后从地址栏复制得到。

## 警告 `Code 安装似乎损坏`

从 v2.0 开始不应该再出现这个问题，不管怎样可以参考 `如何删除插件` 部分。

## 删除/禁用 插件后，背景图依然存在

参考 `如何删除插件` 部分。

## 如何删除插件

三种方式：

1. 推荐方式：

   - 点击状态栏右下角「Background」按钮，选择「卸载插件」，完成自动化卸载。

2. 先禁用再卸载：

   - 在 settings.json 中设置 `{"background.enabled": false}`
   - 最后再删除插件。

3. 不推荐：

   - 如果直接删除了插件，别担心。
   - `完全` 退出 vscode，`打开` vscode。
   - `再次` 重启 vscode，图片会被清理掉。
   - ，，，这是一种奇怪的 vscode 的限制。

## read-only file system - 各种无权限问题。

需要 `vscode` 位于一个有可写权限的位置.

- windows:
  - 右键 `vscode` 图标，选择 `以管理员身份运行`。
- mac:
  - 把 vscode 从 `Download/下载` 目录移动到 `Application/应用` 目录.
  - 执行 `sudo chmod -R a+rw '/Applications/Visual Studio Code.app'` 来提升权限.
- linux:
  - 执行 `sudo chmod -R a+rw /usr/share/code`。
  - 一些 Arch Linux: `sudo chmod -R a+rw /opt/visual-studio-code`
  - Code Server (docker): `sudo chmod -R a+rw '/usr/lib/code-server'`
    - code-server 需要强制刷新浏览器（避免缓存）来使配置生效。

## 不支持的环境

- `通过snap安装` 不可用。 [#382](https://github.com/shalldie/vscode-background/issues/382)
  - Error: (Linux) snap: read-only file system
  - Snap 使用 [SquashFS](https://en.wikipedia.org/wiki/SquashFS) 存储包，这是一个压缩的只读文件系统。可以使用 deb 或者 rpm 来安装 vscode。
- `vscodium` 不完全支持。
  - 大部份情况能够正常运行。但我不怎么用它，欢迎 pr。

## vscode 崩溃 [#306](https://github.com/shalldie/vscode-background/issues/306)

无论何时，如果发生vscode崩溃的极端情况，可以按照下方方式手工修复：

1. 打开文件目录：
   - windows: `%LocalAppData%\Programs\Microsoft VS Code\resources\app\out\vs\workbench`
   - mac: `/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench`
   - linux: `/usr/share/code/resources/app/out/vs/workbench`
     - 一些 Arch Linux: `/opt/visual-studio-code/resources/app/out/vs/workbench`
2. 编辑 `workbench.desktop.main.js`，去掉尾部的这部分：`// vscode-background-start...// vscode-background-end`。

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
