import { App } from '../app';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { MsgEnum } from '@/common/message.common.ts';
import type SlotItem from '@/src-vscode/providers/items/slot/slot.item';
import type { SlotGameEquipped } from '@/common/game.common';

export default class SlotPanel {
  public static readonly ViewType = 'slot.panel';
  public static App: App;
  public static ExtContext: vscode.ExtensionContext;
  public static readonly html = 'slot.html';

  // public static CurrentPanel: PlatformPanel | undefined;
  private _disposables: vscode.Disposable[] = [];

  constructor(public readonly contextItem: SlotItem, public readonly panel: vscode.WebviewPanel, public readonly app: App = SlotPanel.App) {
    this._message();
    this._update();

    this.panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }


  get slot() {
    return this.contextItem.slot;
  }


  public dispose() {
    // Clean up our resources
    this.panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();

      if (x) {
        x.dispose();
      }
    }
  }


  private async _message() {
    const webview = this.panel.webview;
    const imageSaveUri = this.app.resolveImageUri('slots');

    const commands = {
      [MsgEnum.OnMount]: () => this._postdata(),
      [MsgEnum.OnError]: ({ text }) => {
        vscode.window.showErrorMessage(text);
      },
      [MsgEnum.OnSubmit]: async ({ slot }: { slot: SlotGameEquipped }) => {
        await this.contextItem.write(slot);
        await this._postdata();
        vscode.window.showInformationMessage(`${slot.GameCode} is updated.`);
      },
      [MsgEnum.ShowSaveDialog]: async () => {
        try {
          const [fileUri] = await vscode.window.showOpenDialog({
            canSelectMany: false,
            canSelectFolders: false,
            canSelectFiles: true,
            filters: {'Images': ['png', 'jpg']}
          });

          const basename = path.basename(fileUri.fsPath);
          const targetUri = vscode.Uri.joinPath(imageSaveUri, basename);

          await vscode.workspace.fs.copy(fileUri, targetUri, { overwrite: true });

          vscode.window.showInformationMessage(`${basename} is saved.`);

          // 修改 game
          this.slot.image = { require: `@siteconfig/templates/images/slots/${basename}` }
          this._postdata();

        } catch (err) {
          throw err;
        }
      }
    }

    webview.onDidReceiveMessage((message) => {
      if (commands[message.command]) {
        commands[message.command]?.(message);
      }

    }, undefined, this.app.extContext.subscriptions);
  }


  private async _update() {
    const webview = this.panel.webview;

    // Vary the webview's content based on where it is located in the editor.
    webview.html = await this._getHtml(webview);
  }


  private _postdata(slot = this.slot) {
    const webview = this.panel.webview;
    const siteconfigUri = this.app.resolveSiteconfigUri();

    return webview.postMessage({
      command: MsgEnum.PostData,
      slot: slot,
      platform: this.app.GamePlatformMap[slot.GamePlatform],
      prefix: webview.asWebviewUri(siteconfigUri).toString(),
    });
  }


  private async _getHtml(webview: vscode.Webview): Promise<string> {
    try {
      const baseUrl = webview.asWebviewUri(this.app.resolvePublicUri()).toString()
      const htmlUri = this.app.resolvePublicUri(SlotPanel.html);
      const html = fs.readFileSync(htmlUri.fsPath, 'utf-8');

      return html.replace('[baseurl]', `${baseUrl}/`);
    } catch (err) {
      const msg = `RenderError: ${err.message}`;

      vscode.window.showErrorMessage(msg);

      throw err;
    }
  }


  /**
   * 註冊入口
   * @param app
   */
  public static use(app: App) {
    const { extContext } = app;

    SlotPanel.App = app;
    SlotPanel.ExtContext = extContext;

    extContext.subscriptions.push(
      vscode.commands.registerCommand(App.Commands.OpenSlotWebview, (contextItem: SlotItem) => {
        SlotPanel.createOrShow(contextItem, app);
      })
    );
  }


  /**
   * 路徑resolver
   * @param p
   */
  public static extContextUri(...p: string[]) {
    return vscode.Uri.joinPath(SlotPanel.App.ExtensionUri, ...p);
  }


  /**
   * 建立或者顯示 遊戲平台編輯畫面
   * @param game
   * @param app
   */
  public static createOrShow(contextItem: SlotItem, app = this.App) {
    const { slot } = contextItem;

    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    // if (PlatformPanel.CurrentPanel) {
    //   PlatformPanel.CurrentPanel.panel.reveal(column);
    //   return;
    // }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      SlotPanel.ViewType,
      slot.GameCode,
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          this.extContextUri('resources'),
          this.extContextUri('public'),
          this.App.resolveRootUri(),
        ]
      }
    );

    new SlotPanel(contextItem, panel, app);
  }
}
