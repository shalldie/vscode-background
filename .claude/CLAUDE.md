# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`vscode-background` 是一个 VS Code 插件，通过修改 VS Code 安装目录中的 `workbench.html` 文件来注入背景图样式与脚本。它不是普通的 webview/扩展面板插件——而是 **patch VS Code 自身的文件**，因此对 VS Code 版本、文件权限、安装路径敏感。

## Common Commands

```bash
npm run compile      # tsc 编译到 out/
npm run watch        # 开发时 watch 模式
npm run lint         # ESLint，pre-commit 钩子也会跑
npm run package      # vsce package，生成 .vsix
```

调试：在 VS Code 中按 F5（`.vscode/launch.json`），会启动一个加载本扩展的 Extension Host 窗口。
没有单元测试套件——验证修改要靠在 Extension Host 中手动跑 `Background: Install` / `[Dev] Preview Patch` 等命令。

## Architecture

### 核心机制：通过 HTML 注入脚本

入口 `src/extension.ts` 创建 `Background` 实例。`Background.applyPatch()` 流程：

1. `PatchGenerator.create(config)` 把用户配置编译成一段 JS 代码（多个 IIFE 拼接，最后用 `uglify-js` 压缩）。
2. `HtmlPatchFile.applyPatches(content)` 将生成的脚本**内联**到 `workbench.html` 末尾的 `<script>` 标签中，包裹在 `<!-- vscode-background-start -->` 与 `<!-- vscode-background-end -->` 注释之间；同时在 CSP 中注入 `'unsafe-inline'` 以允许内联脚本执行。
3. 用户重启 VS Code 后 HTML 加载注入的脚本，把样式/图片注入到 workbench DOM。

VS Code 的 `workbench.html` 路径由 `src/utils/vscodePath.ts` 推断：
- Desktop: `out/vs/code/electron-browser/workbench/workbench.html`
- Web/code-server: `out/vs/code/browser/workbench/workbench.html`

修改这些文件通常需要写权限；写失败时会通过 `@vscode/sudo-prompt` 提权重试（见 `PatchFile.base.ts` 的 `saveContentTo`）。

### 为什么用 HTML 而不是修改 JS 文件

VS Code 1.123.0+ 对 `vscode-file://` 协议的 JS 资源启用了内存缓存，直接修改 `workbench.desktop.main.js` 后 reload 仍会加载缓存版本。HTML 作为 BrowserWindow 入口每次都从磁盘重新读取，将脚本内联到 `workbench.html` 中可确保每次都是最新内容。

### Patch 状态判断

`AbsPatchFile.getPatchType()` 通过查找文件中的标记字符串区分三种状态：
- `Latest`: 文件包含 `${BACKGROUND_VER}.${VERSION}`（当前版本号）
- `Legacy`: 包含 `BACKGROUND_VER`（`'background.ver'`）但不是当前版本——通常是 background 升级或 VS Code 升级后
- `None`: 干净文件

`setup()` 在激活时：
1. 先调用 `removeLegacyJsPatch()` 清除 v2.1 之前遗留在 JS 文件（`workbench.desktop.main.js`）中的 patch。
2. 若发现 `enabled && (Legacy || None)`，弹通知提示 "Apply and Reload"。

### PatchGenerator 子模块

`src/background/PatchGenerator/` 下每个生成器对应一种「区块」：
- `editor` / `sidebar` / `auxiliarybar` / `panel`：通过 CSS `::before`/`::after` 在对应 workbench 容器上盖图片
- `fullscreen`：覆盖整个 workbench
- `theme`：hack 主题相关样式
- `checksums`：隐藏 VS Code 启动时的 "your installation is corrupt" 警告通知

所有继承 `AbsPatchGenerator`（`PatchGenerator.base.ts`），通过 `getStyle()` / `getScript()` 钩子贡献片段，由 `create()` 组合并经 `stylis` 编译 CSS。

图片来源处理（在基类构造函数中）支持：`https://`、`data:`、本地文件、本地目录（用 `fast-glob` 扫支持的扩展名）；本地路径会被归一化为 `vscode-file://vscode-app/...` 协议（v1.51.1+ 的沙盒访问限制需要）。

### 卸载

`src/uninstall.ts` 是 `package.json` 中的 `vscode:uninstall` 钩子。**不能引用 vscode API**（钩子运行时 vscode 已退出），只能 `import` 到具体文件——所以这里直接从 `PatchFile/PatchFile.html` 导入而不是 `background/index`，避免间接拉入 vscode 相关代码。

HTML 文件的实际路径通过 `TOUCH_FILE_PATH`（一个版本号命名的 touch 文件，如 `vscb.2.1.1.touch`，在扩展根目录）记录——文件**内容**存储 `workbenchHtmlPath`，文件**是否存在**用于判断是否首次加载。卸载时 `vscodePath.ts` 中依赖 vscode API 的逻辑不可用，因此通过此文件获取路径。

### 国际化

`l10n/` 目录使用 VS Code 的 `vscode.l10n.t()` API。`package.nls*.json` 用于 `package.json` 中的 `%key%` 占位。

## Release Checklist

每次发版需手动更新以下文件：

- `package.json` — `version` 字段
- `CHANGELOG.md` — 顶部新增版本条目（记录本次变更）
- `README.md` / `README.zh-CN.md` / `README.ja-JP.md` — badge 中的静态版本号（`/badge/version-x.x.x-blue`）

## Conventions

- 模块路径以 `Node16`（ES module 风格）解析，`tsconfig` 严格模式开启。
- imports 由 `@ianvs/prettier-plugin-sort-imports` 自动排序——直接跑 `prettier --write` 或依赖编辑器集成；不要手动调整 import 顺序。
- 中文注释普遍存在；项目支持中/英/日 README，新增用户可见文案应同步到 `package.nls*.json`、`l10n/bundle.l10n.*.json`、`docs/welcome.*.md`。
- 修改 patch 注入逻辑后，用 `[Dev] Preview Patch` 命令（`extension.background.previewPatch`）查看最终生成的脚本进行验证。
