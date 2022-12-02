<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md)

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](https://user-images.githubusercontent.com/9987486/40583704-6accf3a4-61c6-11e8-8c00-a636b9c3ec65.png)

<h1><b>vscode-background</b></h1>

### [Visual Studio Code](https://code.visualstudio.com) にも背景画像を。

`エディターごとの画像表示`、`全画面の画像表示`、`画像の切り替わり`、`画像・CSSのカスタマイズ`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/visual-studio-marketplace/v/shalldie.background?logo=visualstudiocode&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/workflow/status/shalldie/vscode-background/ci?label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

</div>

<!-- 封面区域 end -->

---

エディターごとの画像

<img width="880" src="https://user-images.githubusercontent.com/9987486/40583705-7105dda8-61c6-11e8-935a-3c5d475a1eb1.gif">

背景画像の全画面表示

<img width="880" src="https://user-images.githubusercontent.com/9987486/198958380-6eaf96c7-3aa2-4fce-b27e-6f33c8d4e2c1.png">

## インストール

サイドバーの拡張機能タブから`background`を検索！

```
ext install background
```

## カスタマイズ

`settings.json`からユーザー設定をカスタマイズすることができます。

[settings.json とは](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [設定方法](https://github.com/shalldie/vscode-background/issues/274)

## コンフィグ

### 基本設定

| 設定                 |  タイプ   | デフォルト | 説明                                       |
| :------------------- | :-------: | :--------: | :----------------------------------------- |
| `background.enabled` | `Boolean` |   `true`   | 拡張機能を有効化するかどうかを制御します。 |

### デフォルト設定

| 設定                      |     タイプ      |  デフォルト  | 説明                                                                        |
| :------------------------ | :-------------: | :----------: | :-------------------------------------------------------------------------- |
| `background.useFront`     |    `Boolean`    |    `true`    | 画像を最前面に表示するかどうかを制御します。                                |
| `background.useDefault`   |    `Boolean`    |    `true`    | デフォルトの画像を使用するかどうかを制御します。                            |
| `background.style`        |    `Object`     |     `{}`     | 全ての画像に適応される CSS を制御します。                                   |
| `background.styles`       | `Array<Object>` | `[{},{},{}]` | 個別の画像に適応される CSS を制御します。                                   |
| `background.customImages` | `Array<String>` |     `[]`     | 画像のパスを指定してください。                                              |
| `background.loop`         |    `Boolean`    |   `false`    | 画像をリピートするかどうかを制御します。                                    |
| `background.interval`     |    `Number`     |     `0`      | 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。 |

> `CSS`について知る [css style](https://developer.mozilla.org/ja/docs/Learn/CSS/First_steps/What_is_CSS)

### フルスクリーン設定

> デフォルト設定を上書きする可能性があります。

| 設定                    |  タイプ  | デフォルト | 説明                        |
| :---------------------- | :------: | :--------: | :-------------------------- |
| `background.fullscreen` | `Object` |   `null`   | Set the image to fullscreen |

example:

```json
{
  "background.fullscreen": {
    "image": "https://pathtoimage.png", // URLもしくはファイルパス(file:///~/~.png)
    // "image": ["https://pathtoimage.png"], // 配列を使用することで複数の画像を設定できます
    "opacity": 0.91, // 0.85 ~ 0.95 がおすすめです
    "size": "cover", // CSSのbackground-sizeに相当します。`cover` ,`contain`,`200px 200px` のように設定します
    "interval": 0 // 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。
  }
}
```

## 使用例

1. 拡張機能を無効化する

```json
{
  "background.enabled": false
}
```

2. カスタムイメージを使用する

**https** 通信を採用しているリンクを使用する必要があります， http 通信は VSCode により制限されています。

```json
{
  "background.useDefault": false,
  "background.customImages": ["https://a.com/b.png", "file:///Users/somepath/a.jpg"]
}
```

3. カスタム CSS - 透明度

```json
{
  "background.style": {
    "opacity": 0.6
  }
}
```

4. カスタム CSS - 画像サイズ

```json
{
  "background.style": {
    "background-size": "300px 460px" //"横幅 縦幅"
  }
}
```

5. 全画面表示

```json
{
  "background.fullscreen": {
    "image": "https://pathtoimage.png", // URLもしくはファイルパス(file:///~/~.png)
    // "image": ["https://pathtoimage.png"], // 配列を使用することで複数の画像を設定できます
    "opacity": 0.91, // 0.85 ~ 0.95 がおすすめです
    "size": "cover", // CSSのbackground-sizeに相当します。`cover` ,`contain`,`200px 200px` のように設定します
    "interval": 0 // 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。
  }
}
```

## 警告

> **この拡張機能は、VSCode 本体の CSS ファイルを編集することで機能します。**
>
> そのため、初回インストール時または vscode 更新時に警告が表示されます，[二度と表示しない] をクリックして非表示にできます。

![](https://user-images.githubusercontent.com/9987486/40583926-b1fb5398-61ca-11e8-8271-4ac650d158d3.png)

原因:

![](https://user-images.githubusercontent.com/9987486/40583775-91d4c8d6-61c7-11e8-9048-8c5538a32399.png)

## アンインストール

    ３つの方法

    1. (おすすめ)

    F1キーを押し、コマンドパネルを開ます。
    「Background - Uninstall (remove extension)」と入力して、
    自動アンインストールします。

    2.

    setting.jsonで{"background.enabled": false}  と変更してから　　
    手動でアンインストールします。

    3. An unfriendly way:

    If you uninstall this plugin directly, don't worry.
    Exit vscode completely, then open, then reload. Now it's clean :D
    (I know it's strange... Because of the limit of vscode)

## 貢献者 🙏

[<img alt="shalldie" src="https://avatars3.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
[<img alt="NoDocCat" src="https://avatars.githubusercontent.com/u/20502666?v=4" width="80">](https://github.com/NoDocCat)
[<img alt="frg2089" src="https://avatars.githubusercontent.com/u/42184238?v=4" width="80">](https://github.com/frg2089)
[<img alt="mwSora" src="https://avatars.githubusercontent.com/u/23083011?v=4" width="80">](https://github.com/mwSora)
[<img alt="tumit" src="https://avatars.githubusercontent.com/u/1756190?v=4" width="80">](https://github.com/tumit)
[<img alt="asurinsaka" src="https://avatars.githubusercontent.com/u/8145535?v=4" width="80">](https://github.com/asurinsaka)
[<img alt="u3u" src="https://avatars.githubusercontent.com/u/20062482?v=4" width="80">](https://github.com/u3u)
[<img alt="kuresaru" src="https://avatars.githubusercontent.com/u/31172177?v=4" width="80">](https://github.com/kuresaru)
[<img alt="Unthrottled" src="https://avatars.githubusercontent.com/u/15972415?v=4" width="80">](https://github.com/Unthrottled)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/15815422?v=4" width="80">](https://github.com/rogeraabbccdd)

## チェンジログ

[チェンジログ](https://github.com/shalldie/vscode-background/blob/master/CHANGELOG.md)で全ての変更を確認できます。

## よくある質問

---

    Q: [Code インストールが壊れている可能性があります。]を消すには?
    A: 確認してください: https://github.com/lehni/vscode-fix-checksums

---

    Q: MACに拡張機能をインストールしましたが、機能しません。
    A: `Visual Studio Code` を`Download`フォルダー から`Applications`フォルダーに移動してください。

---

    Q: The extension runs based on the modified vscode CSS file, and will try to raise the right within a limited time.
       If it stop working for some reason, what if users need to change their permissions?

    A: In windows,click right button on the vscode's icon,then check the [run with the administrator authority].
    A: in mac/linux, try this: https://github.com/shalldie/vscode-background/issues/6 .

---

## ライセンス

MIT
