<!-- 中英文切换 -->
<div align="right">

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md) | [Portugues](./README.pt-BR.md)

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](https://user-images.githubusercontent.com/9987486/40583704-6accf3a4-61c6-11e8-8c00-a636b9c3ec65.png)

<h1><b>vscode-background</b></h1>

### Insira planos de fundo no seu [Visual Studio Code](https://code.visualstudio.com)

`code area`、`fullscreen`、`carousel`、`custom images/styles`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/visual-studio-marketplace/v/shalldie.background?logo=visualstudiocode&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/shalldie.background?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shalldie/vscode-background/ci.yml?branch=master&label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

</div>

<!-- 封面区域 end -->

---

Area de código

<img width="880" src="https://user-images.githubusercontent.com/9987486/40583705-7105dda8-61c6-11e8-935a-3c5d475a1eb1.gif">

Tela cheia

<img width="880" src="https://user-images.githubusercontent.com/9987486/198958380-6eaf96c7-3aa2-4fce-b27e-6f33c8d4e2c1.png">

## Instalação

Para instalar a extensão, apenas execute o comando abaixo na paleta de comando do Visual Studio Code.

```
ext install background
```

## Personalização

Os requisitos definidos pelo usuário podem ser alterados usando a configuração disponivel no arquivo
(`settings.json`).

[O que é settings.json](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [onde está localizado](https://github.com/shalldie/vscode-background/issues/274)

## Configuração

### Configuração Base

| Nome                 |   Tipo    | Padrão | Descrição                          |
| :------------------- | :-------: | :----: | :--------------------------------- |
| `background.enabled` | `Boolean` | `true` | Habilita ou desabilita este plugin |

### Configuração Padrão

| Nome                      |      Tipo       |    Padrão    | Descrição                                                            |
| :------------------------ | :-------------: | :----------: | :------------------------------------------------------------------- |
| `background.useFront`     |    `Boolean`    |    `true`    | Define se a imagem ficara à frente ou por trás de seu codigo         |
| `background.style`        |    `Object`     |     `{}`     | Personalizar o estilo                                                |
| `background.styles`       | `Array<Object>` | `[{},{},{}]` | Adicionar estilo personalizado para uma imagem                       |
| `background.customImages` | `Array<String>` |     `[]`     | Adiciona suas imagens personalizadas                                 |
| `background.interval`     |    `Number`     |     `0`      | Segundos de intervalo para o carousel, utilize `0` para desabilitar. |

> `style` significa [css style](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS), que permite a criação de planos de fundo atrativos.

### Configuração de Tela cheia

> pode sobrescrever a configuração padrão

| Name                    |   Type   | Default | Description                     |
| :---------------------- | :------: | :-----: | :------------------------------ |
| `background.fullscreen` | `Object` | `null`  | Define a imagem como Tela Cheia |

example:

```json
{
  "background.fullscreen": {
    "images": ["https://pathtoimage.png"], // url da sua imagem
    "opacity": 0.91, // 0.85 ~ 0.95 recomendado
    "size": "cover", // também css, use `cover` para auto-adaptação (recomendado)，ou `contain`、`200px 200px`
    "position": "center", // Equivalente a `background-position`, por omissão `center`
    "interval": 0 // segundos de intervalo para o carousel, use default `0` para desabilitar.
  }
}
```

## Exemplos

1. desabilite esta extensão

```json
{
  "background.enabled": false
}
```

2. imagens customizadas

Voce deve utilizar o protocolo **https** ao invés de **http** para a imagem, **http** não é mais suportado pelo vscode.

```json
{
  "background.customImages": ["https://a.com/b.png", "file:///Users/somepath/a.jpg"]
}
```

3. custom style - opacity

```json
{
  "background.style": {
    "opacity": 0.6
  }
}
```

4. custom style - image size

```json
{
  "background.style": {
    "background-size": "300px 460px"
  }
}
```

5. full screen

```json
{
  "background.fullscreen": {
    "images": ["https://pathtoimage.png"], // url da sua imagem
    "opacity": 0.91, // 0.85 ~ 0.95 recomendado
    "size": "cover", // também css, use `cover` para auto-adaptação (recomendado)，ou `contain`、`200px 200px`
    "position": "center", // Equivalente a `background-position`, por omissão `center`
    "interval": 0 // segundos de intervalo para o carousel, use default `0` para desabilitar.
  }
}
```

## Avisos

> **Essa extensão funciona através da edição do arquivo css do vscode**
>
> Dessa forma, um aviso aparece durante a primeira instalação, pedindo para instalar ou atualizar o vscode. Voce pode clicar o botão [nao mostrar novamente] para o erro não aparecer novamente.

![](https://user-images.githubusercontent.com/9987486/40583926-b1fb5398-61ca-11e8-8271-4ac650d158d3.png)

Esta é a razão:

![](https://user-images.githubusercontent.com/9987486/40583775-91d4c8d6-61c7-11e8-9048-8c5538a32399.png)

## Desinstalação

    Tres maneiras

    1. (recomendado)

    pressione `F1` para abrir a paleta de comando, escolha `Background - Uninstall (remove extension)` , automaticamente a desinstalação será feita.

    2.

    Setar a configuração {"background.enabled": false}  no arquivo settings.json, então desinstalar o plugin.

    3. Um jeito nao tão amigavel:

    Caso voce desinstale esse plugin diretamente, não se preocupe.
    Feche completamente o Vscode, abra novamente, recarregue o Vscode. Desta forma ficará limpa a desinstalação :D
    (É meio estranho... mas é uma limitação do vscode)

## Contributors 🙏

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

## CHANGELOG

Voce pode verificar todas as mudanças no [change log](https://github.com/shalldie/vscode-background/blob/master/CHANGELOG.md).

## Q&A

---

    Q: Como remover a tag [unsupported]?
    A: Veja aqui: https://github.com/lehni/vscode-fix-checksums

---

    Q: Aparentemente não acontece nada depois de instalar a extensão no MAC?
    A: No Mac, mova o `vscode` de `Download` para `Applications`.

---

    Q: A extensão funciona baseada na versão modificada do arquivo CSS, e vai tentar elevar as permissões durante um tempo limitado.
       Se isso parar de funcionar por qualquer motivo, como o usuário fará para mudar as permissões?

    A: No windows, clique com o botão direito no icone do Vscode, então marque o checkbox [rodar com permissões de administrador].
    A: No mac/linux, tente isso: https://github.com/shalldie/vscode-background/issues/6 .

---

## LICENSE

MIT
