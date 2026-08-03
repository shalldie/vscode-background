import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

// 是否 watch 模式。F5 调试经 preLaunchTask 走 `--watch`；
// 一次性 compile / 发布 prepublish 都不带 --watch。
// 以此区分：仅 F5(watch) 生成 sourcemap，其余场景不生成。
const watchMode = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',

    setup(build) {
        build.onStart(() => {
            console.log('[esbuild] build started');
        });
        build.onEnd(result => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (!location) {
                    return;
                }
                console.error(`    ${location.file}:${location.line}:${location.column}:`);
            });
            console.log('[esbuild] build finished');
        });
    }
};

async function main() {
    // 构建前清空 dist，避免 watch 生成的 .map 残留到发版产物
    rmSync('dist', { recursive: true, force: true });

    const ctx = await esbuild.context({
        // 两个入口：扩展主体 + 卸载钩子（vscode:uninstall）
        entryPoints: ['src/extension.ts', 'src/uninstall.ts'],
        bundle: true,
        format: 'cjs',
        // 始终不压缩
        minify: false,
        // 默认不生成 sourcemap，仅 F5 调试(watch)时生成
        sourcemap: watchMode,
        sourcesContent: false,
        platform: 'node',
        // 输出到单层目录 dist/，保持 __dirname/../ 仍指向扩展根目录
        outdir: 'dist',
        // vscode 由宿主提供，且卸载钩子运行时不可用（vsc.ts 里 try/catch require）
        external: ['vscode'],
        logLevel: 'warning',
        plugins: [esbuildProblemMatcherPlugin]
    });
    if (watchMode) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
