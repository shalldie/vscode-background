/**
 * FIXME:
 * Uninstall hook not executing
 * vscode:uninstall 没有执行
 * https://github.com/microsoft/vscode/issues/155561
 */

import * as background from './background';

const uninstall = async () => {
    if (await background.getCssContent().then(background.hasInstalled)) {
        await background.uninstall();
    }
};
uninstall();
