import path from 'path';

const assetsBase = path.join(__dirname, '..', 'assets');
/**
 * 内建图片
 */
export const builtin = [
    // 这条注释用于关闭ESLint警告
    path.join(assetsBase, '1.png'),
    path.join(assetsBase, '2.png'),
    path.join(assetsBase, '3.png')
];
