<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語**

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](./images/logo.png)

<h1><b>vscode-background</b></h1>

### [Visual Studio Code](https://code.visualstudio.com) にも背景画像を。

`フルスクリーン`、`エディター`、`サイドバー`、`補助バー(auxiliarybar)`、`パネル`、`画像の切り替わり`、`画像・CSSのカスタマイズ`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/visual-studio-marketplace/v/shalldie.background?logo=visualstudiocode&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shalldie/vscode-background/ci.yml?branch=master&label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

複数の領域、`エディタ`、`サイドバー`、`補助バー(auxiliarybar)`、`パネル`

<img width="760" src="./images/section.png">

`フルスクリーン`

<img width="760" src="./images/fullscreen.png">

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

| 設定                 |    型     | デフォルト | 説明                                       |
| :------------------- | :-------: | :--------: | :----------------------------------------- |
| `background.enabled` | `Boolean` |   `true`   | 拡張機能を有効化するかどうかを制御します。 |

### エディタ部分の設定

エディタ部分の設定を行うには、`background.editor`を編集します．

| 設定       |     型     |  デフォルト  | 説明                                                                        |
| :--------- | :--------: | :----------: | :-------------------------------------------------------------------------- |
| `useFront` | `boolean`  |    `true`    | 画像を最前面に表示するかどうかを制御します。                                |
| `style`    |  `object`  |     `{}`     | 全ての画像に適応される CSS を制御します。 [MDN Reference][mdn-css]          |
| `styles`   | `object[]` | `[{},{},{}]` | 個別の画像に適応される CSS を制御します。                                   |
| `images`   | `string[]` |     `[]`     | カスタム画像に対応、オンライン画像やローカル画像、フォルダもサポート。      |
| `interval` |  `number`  |     `0`      | 次の画像を表示するまでの秒数を制御します。`0`の場合、画像は変更されません。 |
| `random`   | `boolean`  |   `false`    | 画像の表示順をランダムにするかを制御します。                                |

[mdn-css]: https://developer.mozilla.org/docs/Web/CSS

設定例：

```json
{
  "background.editor": {
    "useFront": true,
    "style": {
      "background-position": "100% 100%",
      "background-size": "auto",
      "opacity": 0.6
    },
    "styles": [{}, {}, {}],
    // `images`はオンライン画像、ローカル画像、およびフォルダをサポートしています。
    "images": [
      // オンライン画像については、`https`のみ許可されています。
      "https://hostname/online.jpg",
      // ローカル画像
      "file:///local/path/img.jpeg",
      "/home/xie/downloads/img.gif",
      "C:/Users/xie/img.bmp",
      "D:\\downloads\\images\\img.webp",
      // ローカルフォルダ
      "/home/xie/images",
      // data URL
      "data:image/*;base64,<base64-data>"
    ],
    "interval": 0,
    "random": false
  }
}
```

### フルスクリーン、サイドバー、補助バー(auxiliarybar)、パネル部分の設定

`background.fullscreen`、`background.sidebar`、`background.auxiliarybar`、`background.panel`を編集してこれらの領域を設定します。

| 設定       |     型     | デフォルト | 説明                                                                                                       |
| :--------- | :--------: | :--------: | :--------------------------------------------------------------------------------------------------------- |
| `images`   | `string[]` |    `[]`    | カスタム画像に対応、オンライン画像やローカル画像、フォルダもサポート。                                     |
| `opacity`  |  `number`  |   `0.1`    | 画像の不透明度を制御します、[opacity][mdn-opacity]へのエイリアスです。推奨値 `0.1 ～ 0.3`。                |
| `size`     |  `string`  |  `cover`   | [background-size][mdn-background-size]へのエイリアスです。推奨 `cover`，縦横比を保ったまま領域を覆います。 |
| `position` |  `string`  |  `center`  | [background-position][mdn-background-position]へのエイリアスです。デフォルト値は `center` です。           |
| `interval` |  `number`  |    `0`     | 次の画像を表示するまでの秒数を制御します。`0` の場合、画像は変更されません。                               |
| `random`   | `boolean`  |  `false`   | 画像の表示順をランダムにするかを制御します。                                                               |

[mdn-opacity]: https://developer.mozilla.org/docs/Web/CSS/opacity
[mdn-background-size]: https://developer.mozilla.org/docs/Web/CSS/background-size
[mdn-background-position]: https://developer.mozilla.org/docs/Web/CSS/background-position

example:

```json
{
  "background.fullscreen": {
    // `images`はオンライン画像、ローカル画像、およびフォルダをサポートしています。
    "images": [
      // オンライン画像については、`https`のみ許可されています。
      "https://hostname/online.jpg",
      // ローカル画像
      "file:///local/path/img.jpeg",
      "/home/xie/downloads/img.gif",
      "C:/Users/xie/img.bmp",
      "D:\\downloads\\images\\img.webp",
      // ローカルフォルダ
      "/home/xie/images",
      // data URL
      "data:image/*;base64,<base64-data>"
    ],
    "opacity": 0.1,
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

[<img alt="shalldie" src="https://avatars.githubusercontent.com/u/9987486?v=4" width="80">](https://github.com/shalldie)
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
