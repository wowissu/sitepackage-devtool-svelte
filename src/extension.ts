// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sitepackage-vscode-devtool" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.sitepackage-devtool-open', () => {
    // The code you place here will be executed every time your command is executed

    const indexHtmlUri = vscode.Uri.file(path.join(context.extensionPath, 'out/app/index.html'));
    const appPath = vscode.Uri.file(path.join(context.extensionPath, 'out/app'));

    // console.log(context.globalStoragePath, context.globalStorageUri);

    // Display a message box to the user
    const panel = vscode.window.createWebviewPanel(
      'devtool', // Identifies the type of the webview. Used internally
      'Sitepackage Devtool', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
      }, // Webview options. More on these later.
    );

    const publicPath = panel.webview.asWebviewUri(appPath).toString();
    const content = fs.readFileSync(indexHtmlUri.fsPath, 'utf8').replace(/\[PublicPath\]/g, publicPath)
    console.log(publicPath)
    console.log(content);
    panel.webview.html = content;
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
