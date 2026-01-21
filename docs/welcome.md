# vscode-background

Welcome to use `background@${VERSION}`, the new version has more features and will bring you a better coding experience!

Different system paths and folders are supported in `images` now:

```json
{
  "images": [
    // online images, only `https` is allowed.
    "https://hostname/online.jpg",
    // local images
    "file:///local/path/img.jpeg",
    "/home/xie/downloads/img.gif",
    "C:/Users/xie/img.bmp",
    "D:\\downloads\\images\\img.webp",
    // local folders
    "/home/xie/images",
    // data URL
    "data:image/*;base64,<base64-data>"
  ]
}
```

## More configurable sections

Each section can be customized with features such as `custom images/styles`、`carousel`、`random display`...

<img src="../images/containers.png" width="800" />

## Clear and concise configuration

Each section has independent configuration, see [README.md](https://github.com/shalldie/vscode-background) to learn more.

```json
{
  "background.sidebar": {...},     // sidebar
  "background.editor": {...},      // editor
  "background.panel": {...},       // panel
  "background.fullscreen": {...},  // fullscreen
  "background.auxiliarybar": {...} // auxiliarybar
}
```

## Quick Command

Click the 「Background」 button on the right-bottom of statusbar, all commands of `background` will appear:

<img width="660" src="../images/commands.png">

## No more warnings

No more warnings about `Your Code installation appears to be corrupt`.

## Migration from v1

> The configuration of v1 is outdated and needs to be migrated. Currently maintaining a certain level of compatibility.

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

v2, migrated to `background.editor`:

```json
{
  "background.editor": {
    "useFront": true,
    "images": [],
    ...
  }
}
```

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
