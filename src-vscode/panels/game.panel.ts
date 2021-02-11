import { App } from '../app';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MsgEnum } from '@/common/message.common.ts';
import type GameItem from '../providers/items/game/game.platform.item';

export default class GamePanel {
  public static readonly ViewType = 'game.panel';
  public static App: App;
  public static ExtContext: vscode.ExtensionContext;
  // public static CurrentPanel: PlatformPanel | undefined;
  private _disposables: vscode.Disposable[] = [];


  constructor(public readonly contextItem: GameItem, public readonly panel: vscode.WebviewPanel, public readonly app: App = GamePanel.App) {
    this._message();
    this._update();

    this.panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }


  get game() {
    return this.contextItem.game;
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
    const imageSaveUri = this.app.resolveImageUri();

    const commands = {
      [MsgEnum.OnMount]: () => this._postgame(),
      [MsgEnum.OnError]: ({ text }) => {
        vscode.window.showErrorMessage(text);
      },
      [MsgEnum.OnSubmit]: async ({ game }) => {
        await this.contextItem.write(game);
        await this._postgame();
        vscode.window.showInformationMessage(`${game.id} is updated.`);
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
          this.game.image = { require: `@siteconfig/templates/images/${basename}` }
          this._postgame();

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


  private _postgame() {
    const webview = this.panel.webview;
    const siteconfigUri = this.app.resolveSiteconfigUri();

    return webview.postMessage({
      command: MsgEnum.PostData,
      game: this.game,
      prefix: webview.asWebviewUri(siteconfigUri).toString(),
    });
  }


  private async _getHtml(webview: vscode.Webview): Promise<string> {
    try {
      const publicUri = vscode.Uri.joinPath(GamePanel.App.ExtensionUri, 'public');
      const htmlUri = vscode.Uri.joinPath(publicUri, 'platform.html');
      const html = fs.readFileSync(htmlUri.fsPath, 'utf-8');

      return html.replace('[baseurl]', `${webview.asWebviewUri(publicUri).toString()}/`);
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

    GamePanel.App = app;
    GamePanel.ExtContext = extContext;

    extContext.subscriptions.push(
      vscode.commands.registerCommand(App.Commands.OpenGameWebview, (contextItem: GameItem) => {
        GamePanel.createOrShow(contextItem);
      })
    );
  }


  /**
   * 路徑resolver
   * @param p
   */
  public static extContextUri(...p: string[]) {
    return vscode.Uri.joinPath(GamePanel.App.ExtensionUri, ...p);
  }


  /**
   * 建立或者顯示 遊戲平台編輯畫面
   * @param game
   * @param app
   */
  public static createOrShow(contextItem: GameItem, app = this.App) {
    const { game: game } = contextItem;

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
      GamePanel.ViewType,
      `${game.GamePlatformKey} - ${game.GameCategoryKey}`,
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

    new GamePanel(contextItem, panel, app);
  }
}
