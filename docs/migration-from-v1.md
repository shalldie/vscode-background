## Migration from v1

> The configuration of v1 is outdated and needs to be migrated. Currently maintaining a certain level of compatibility.
>
> You can download the default images of v1 version [from here](https://github.com/shalldie/vscode-background/issues/106#issuecomment-392311967).

> v1 的配置已经过时，需要进行迁移。当前保持一定的兼容性。
>
> 可以从这里 [下载v1版本中的默认图片](<(https://github.com/shalldie/vscode-background/issues/106#issuecomment-392311967)>)。

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
