// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var vsHelp = require('./src/vsHelp');
var Background = require('./src/background');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "background" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json



    var disposableInfo = vscode.commands.registerCommand('extension.background.info', function () {
        vsHelp.showInfo('You can config your background in settings.json. Enjoy it!');
    });

    context.subscriptions.push(new Background());

    context.subscriptions.push(disposableInfo);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;