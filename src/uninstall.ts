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
