// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type * as vscode from 'vscode';
import AppTreeProvider from './providers/provider';
import { App } from './app';
import PlatformPanel from './panels/platform.panel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  const app = new App(context);

  app.init().then(() => {
    PlatformPanel.use(app);
    AppTreeProvider.use(app);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  // ...
}

