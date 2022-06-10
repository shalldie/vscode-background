import { background } from './background';
import { vsHelp } from './vsHelp';

background.hasInstalled().then(async hasInstalled => {
    if (hasInstalled) {
        if (await background.uninstall()) {
            vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
        }
    }
});
