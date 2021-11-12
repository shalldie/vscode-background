import { background } from './background';
import { vsHelp } from './vsHelp';

if (background.hasInstalled) {
    background.uninstall();
    vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
}
