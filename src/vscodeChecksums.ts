import { vscodePath } from './vscodePath';
import crypto from 'crypto';
import { readFile } from 'fs/promises';

/**
 * 计算的校验值
 */
export const computeChecksum = async (filePath: string) => {
    const content = await readFile(filePath);
    return crypto.createHash('md5').update(content).digest('base64').replace(/=+$/, '');
};

/**
 * 若校验值不同则返回新的product.json内容
 */
export const getNewProduct = (newChecksum: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const product = require(vscodePath.productPath);

    // 获取Key
    const key = vscodePath.cssPath.replace(`${vscodePath.base}`, '').replace(/\\/g, '/').substring(1);

    if (product.checksums[key] !== newChecksum) {
        product.checksums[key] = newChecksum;
        return JSON.stringify(product, null, '\t');
    }
};
