import * as vscode from 'vscode';
import * as fs from 'fs';
import { App } from '../app';
import type { CommonTreeItem } from './items/common.item';
import { TemplateItem } from './items/template/template.item';
import { TemplateListItem } from './items/template/template.list.item';
import { TemplateGamesItem } from './items/template/template.games.item';

export default class AppTreeProvider implements vscode.TreeDataProvider<CommonTreeItem> {

  public static readonly TreeType = 'sitepackage.configurs.treeview';

  public static use(app: App) {
    const configurProvider = new AppTreeProvider(app.resolveTemplatesUri(), app);

    vscode.window.createTreeView(AppTreeProvider.TreeType, {
      treeDataProvider: configurProvider,
      showCollapseAll: true
    });

    // open file
    vscode.commands.registerCommand(App.Commands.OpenFile, (item: TemplateItem) => {
      if (item instanceof TemplateItem) {
        item.showTextDocument();
      }
    });
  }

  private _onDidChangeTreeData: vscode.EventEmitter<CommonTreeItem | undefined | void> = new vscode.EventEmitter<CommonTreeItem | undefined | void>();
  public readonly onDidChangeTreeData: vscode.Event<CommonTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private templateUri: vscode.Uri, public app: App) {}

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: CommonTreeItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(element?: CommonTreeItem): Promise<CommonTreeItem[]> {
    if (element) {
      return element.getItems();
    } else {
      if (this._pathExists(this.templateUri)) {
        return [
          new TemplateListItem({ parent: undefined, provider: this }, this.templateUri),
          new TemplateGamesItem({ parent: undefined, provider: this }, this.app.resolveCommonUri('siteconfig.games.json'))
        ];
      } else {
        vscode.window.showInformationMessage('conf/ is empty');
        return [];
      }
    }
  }

  private _pathExists(p: string | vscode.Uri): boolean {
    try {
      fs.accessSync(p instanceof vscode.Uri ? p.fsPath : p);
    } catch (err) {
      return false;
    }

    return true;
  }
}


