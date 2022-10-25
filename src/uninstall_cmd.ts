import vscode from 'vscode';
import * as background from './background';
import { EXTENSION_ID } from './constants';
import * as prompts from './vsHelp';

export const uninstallExtension = async () => {
    if (!(await background.getCssContent().then(background.hasInstalled))) {
        return;
    }

    await background
        .uninstall(true)
        .then(() => vscode.commands.executeCommand('workbench.extensions.uninstallExtension', EXTENSION_ID))
        .then(prompts.restartOnUninstalledExt);
};
