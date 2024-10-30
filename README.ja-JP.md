<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Portugues](./README.pt-BR.md)

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
[![Build Status](https://img.shields.io/github/actions/workflow/status/shalldie/vscode-background/ci.yml?branch=master&label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

`エディタ`、`サイドバー`、`パネル`、個別に設定

<img width="760" src="./images/section.png">

`フルスクリーン`

<img width="760" src="./images/fullscreen.png">

</div>

</div>

<!-- 封面区域 end -->

## インストール

2つの方法でインストールできます：

1. [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)からインストール
2. vscodeの拡張機能タブから`shalldie.background`を検索

## カスタマイズ

`settings.json`からユーザー設定をカスタマイズすることができます。

[`settings.json` とは](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [設定方法](https://github.com/shalldie/vscode-background/issues/274)

## コンフィグ

<img width="760" src="./images/containers.png">

### グローバル設定

| 設定                 |     型    | デフォルト | 説明                                       |
| :------------------- | :-------: | :--------: | :----------------------------------------- |
| `background.enabled` | `Boolean` |   `true`   | 拡張機能を有効化するかどうかを制御します。 |

### エディタ部分の設定

エディタ部分の設定を行うには、`background.editor`を編集します．

| 設定       |     型     |   デフォルト  | 説明                                                                                |
| :--------- | :--------: | :----------: | :-------------------------------------------------------------------------------- |
| `useFront` | `boolean`  |    `true`    | 画像を最前面に表示するかどうかを制御します。                                          |
| `style`    |  `object`  |     `{}`     | 全ての画像に適応される CSS を制御します。                                            |
| `styles`   | `object[]` | `[{},{},{}]` | 個別の画像に適応される CSS を制御します。                                            |
| `images`   | `string[]` |     `[]`     | `https`または`file`プロトコルで画像のパスを指定してください。複数指定することもできます。|
| `interval` | `number`   |     `0`      | 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。             |
| `random`   | `boolean`  |   `false`    | 画像の表示順をランダムにするかを制御します。                                          |

> `CSS`について知る [css style](https://developer.mozilla.org/ja/docs/Learn/CSS/First_steps/What_is_CSS)

設定例：

```json
{
  "background.editor": {
    "useFront": true,
    "style": {
      "background-position": "100% 100%",
      "background-size": "auto",
      "opacity": 1
    },
    "styles": [{}, {}, {}],
    // ローカルの画像へのfileプロトコルによるパスは、ブラウザにドラッグアンドドロップすることで簡単に取得できます
    "images": ["https://pathtoimage.png", "file:///path/to/local/file"],
    "interval": 0,
    "random": false
  }
}
```

### フルスクリーン、サイドバー、パネル部分の設定

フルスクリーン、サイドバー、パネル部分を設定するには、`background.fullscreen`、`background.sidebar`、`background.panel`を編集します。

| 設定       |     型     |   デフォルト   | 説明                                                                                      |
| :--------- | :--------: | :-----------: | :----------------------------------------------------------------------------------------------- |
| `images`   | `string[]` |     `[]`      | `https`または`file`プロトコルで画像のパスを指定してください。複数指定することもできます。                                         |
| `opacity`  |  `number`  | `0.91`、`0.2` | 画像の不透明度（opacity）を制御します。フルスクリーン環境では`0.85 ~ 0.95`、それ以外では`0.1 ~ 0.3`が推奨値です。             |
| `size`     |  `string`  |    `cover`    | `background-size`へのエイリアスです。`cover`（推奨、縦横比を保ったまま領域を覆います）、`contain`、または`200px 200px`のように指定してください。|
| `position` |  `string`  |   `center`    | `background-position`へのエイリアスです。デフォルト値は`center`です。                                                |
| `interval` |  `number`  |      `0`      | 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。                                       |
| `random`   | `boolean`  |    `false`    | 画像の表示順をランダムにするかを制御します。                                                              |

example:

```json
{
  "background.fullscreen": {
    // ローカルの画像へのfileプロトコルによるパスは、ブラウザにドラッグアンドドロップすることで簡単に取得できます
    "images": ["https://pathtoimage.png", "file:///path/to/local/file"],
    "opacity": 0.91,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  },
  // `sidebar`、`panel`も、`fullscreen`と同様の設定項目を持っています
  "background.sidebar": {},
  "background.panel": {}
}
```

## クイックコマンド

ステータスバーの右下にある「background」をクリックすると、`background`のすべてのコマンドが表示されます：

<img width="660" src="./images/commands.png">

## 注意点

> **この拡張機能は、VSCode 本体の js ファイルを編集することで機能します。**

問題が発生した際は、[Common Issues](docs/common-issues.md)を参照してください。

## アンインストール

[Common Issues#how-to-uninstall](docs/common-issues.md#how-to-uninstall)を参照してください。

## 貢献者 🙏

[<img alt="shalldie" src="https://avatars3.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
[<img alt="suiyun39" src="https://avatars.githubusercontent.com/u/20502666?v=4" width="80">](https://github.com/suiyun39)
[<img alt="frg2089" src="https://avatars.githubusercontent.com/u/42184238?v=4" width="80">](https://github.com/frg2089)
[<img alt="AzureeDev" src="https://avatars.githubusercontent.com/u/23083011?v=4" width="80">](https://github.com/AzureeDev)
[<img alt="tumit" src="https://avatars.githubusercontent.com/u/1756190?v=4" width="80">](https://github.com/tumit)
[<img alt="asurinsaka" src="https://avatars.githubusercontent.com/u/8145535?v=4" width="80">](https://github.com/asurinsaka)
[<img alt="u3u" src="https://avatars.githubusercontent.com/u/20062482?v=4" width="80">](https://github.com/u3u)
[<img alt="kuresaru" src="https://avatars.githubusercontent.com/u/31172177?v=4" width="80">](https://github.com/kuresaru)
[<img alt="Unthrottled" src="https://avatars.githubusercontent.com/u/15972415?v=4" width="80">](https://github.com/Unthrottled)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/15815422?v=4" width="80">](https://github.com/rogeraabbccdd)
[<img alt="rogeraabbccdd" src="https://avatars.githubusercontent.com/u/86603229?v=4" width="80">](https://github.com/SatoMasahiro2005)

## コントリビューションガイド

[Contributing Guide](docs/contributing.md)を参照してください。

## チェンジログ

[チェンジログ](https://github.com/shalldie/vscode-background/blob/master/CHANGELOG.md)で全ての変更を確認できます。

## 画像をシェアする

[こちら](https://github.com/shalldie/vscode-background/issues/106)で背景用の画像のシェアを行っています。

## v1からの移行
v1における設定は古いものであり、互換性は限定的です。
設定の移行の際には、[migration-from-v1.md](docs/migration-from-v1.md)を参照してください。

## ライセンス

MIT
