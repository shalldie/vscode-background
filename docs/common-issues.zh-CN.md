# 常见问题

[English](./common-issues.md) | [中文](./common-issues.zh-CN.md)

## 如何获取本地图片地址

可以把图片拖到浏览器中，然后从地址栏复制得到。

## 警告 `Code 安装似乎损坏`

可能在直接删除插件后出现，参考 `如何删除插件` 部分。

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

   - 如果直接删除了vscode，别担心。
   - `完全` 退出 vscode，`打开` vscode。
   - `再次` 重启 vscode，图片会被清理掉。
   - ，，，这是一种奇怪的 vscode 的限制。

## (Mac) read-only file system，扩展无法正常运行

需要 vscode 位于一个有可写权限的位置，尝试以下两种方式：

1. 把 vscode 从 `Download/下载` 目录移动到 `Application/应用` 目录.
2. 运行 `sudo chmod -R a+w '/Applications/Visual Studio Code.app'` 来提升权限.

## (Linux) snap: read-only file system [#382](https://github.com/shalldie/vscode-background/issues/382)

Snap 使用 [SquashFS](https://en.wikipedia.org/wiki/SquashFS) 存储包，这是一个压缩的只读文件系统。
可以使用 deb 或者 rpm 来安装 vscode。
