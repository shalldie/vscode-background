/** @type {import("prettier").Config} */
module.exports = {
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 4,
    endOfLine: 'auto',
    printWidth: 120,
    bracketSpacing: true,
    arrowParens: 'avoid',
    overrides: [
        {
            files: ['*.md', 'package{,-lock}.json', '*.{yaml,yml}'],
            options: {
                singleQuote: false,
                tabWidth: 2
            }
        }
    ],
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: [
        '<BUILTIN_MODULES>', // Node.js built-in modules
        '',
        '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
        '',
        '^[.]' // relative imports
    ],
    importOrderTypeScriptVersion: '5.9.3'
};
