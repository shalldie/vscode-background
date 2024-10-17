# Common Issues

[English](./common-issues.md) | [中文](./common-issues.zh-CN.md)

## Warn `Your Code installation appears to be corrupt`

It may appear after directly deleting the extension, refer to `How to uninstall` section.

## Disable/Uninstall doesn't remove background images

Refer to `How to uninstall` section.

## How to uninstall

three ways:

1. Recommended way:

   - Click the 「Background」 button on the right-bottom of statusbar, choose `Uninstall the extension`, automatically complete uninstall.

2. Disable and then uninstall:

   - Set the config `{"background.enabled": false}` in settings.json
   - Then uninstall the extension.

3. Not recommended:

   - If you uninstall this extension directly, don't worry.
   - Exit vscode `completely`, then open vscode.
   - Reload again, now it's clean.
   - ... It's a strange limit of vscode.

## (Mac) read-only file system

`vscode` needs to be located in a location with write permission. Try the following two ways:

1. Move `Visual Studio Code.app` from `Download` to the `Application` directory.
2. Run `sudo chmod -R a+w '/Applications/Visual Studio Code.app'` to grant write permissions.

## (Linux) snap: read-only file system [#382](https://github.com/shalldie/vscode-background/issues/382)

Snap use [SquashFS](https://en.wikipedia.org/wiki/SquashFS) to storage packages, it's a compressed readonly file system.
Try to install vscode using deb or rpm.
