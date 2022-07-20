/**
 * FIXME:
 * Uninstall hook not executing
 * vscode:uninstall 没有执行
 * https://github.com/microsoft/vscode/issues/155561
 */

import { background } from './background';
import { vsHelp } from './vsHelp';

async function uninstall() {
    const hasInstalled = await background.hasInstalled();
    if (hasInstalled) {
        return;
    }

    if (await background.uninstall()) {
        vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
    }
}

uninstall();
