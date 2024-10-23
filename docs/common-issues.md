# Common Issues

[English](./common-issues.md) | [中文](./common-issues.zh-CN.md)

## How to get local images' address

Local images can be dragged into the browser to quickly get the file protocol address from the address bar.

## Warn `Your Code installation appears to be corrupt`

Starting from v2.0, this issue should not occur again. Regardless, you can refer to `How to uninstall` section.

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
   - Exit vscode `completely`, then `open` vscode.
   - `Reload` again, now it's clean.
   - ... It's a strange limit of vscode.

## (Mac) read-only file system

`vscode` needs to be located in a location with write permission. Try the following two ways:

1. Move `Visual Studio Code.app` from `Download` to the `Application` directory.
2. Run `sudo chmod -R a+w '/Applications/Visual Studio Code.app'` to grant write permissions.

## (Linux) snap: read-only file system [#382](https://github.com/shalldie/vscode-background/issues/382)

Snap use [SquashFS](https://en.wikipedia.org/wiki/SquashFS) to storage packages, it's a compressed readonly file system.
Try to install vscode using deb or rpm.

## VSCode crashes [#306](https://github.com/shalldie/vscode-background/issues/306)

Whenever there is an extreme situation where vscode crashes, you can manually fix it as follows:

1. Open the directory:
   - windows: `%LocalAppData%\Programs\Microsoft VS Code\resources\app\out\vs\workbench`
   - mac: `/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench`
2. Replace `workbench.desktop.main.js` with the backup file `workbench.desktop.main.js.background-backup`.

## Prefer v1 default images?

You can download the default images of v1 version [from here](https://github.com/shalldie/vscode-background/issues/106#issuecomment-392311967), or use the config below:

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
