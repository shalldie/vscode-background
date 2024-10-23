## Migration from v1

> The configuration of v1 is outdated and needs to be migrated. Currently maintaining a certain level of compatibility.
>
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

## Prefer v1 default images? - 想继续使用v1版本的默认图片？

You can download the default images of v1 version [from here](https://github.com/shalldie/vscode-background/issues/106#issuecomment-392311967), or use the config below:

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
