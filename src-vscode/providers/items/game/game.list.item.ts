import * as vscode from 'vscode';
import { App } from '../../../app';
import { CommonTreeItem, CommonTreeItemContext } from '../common.item';
import type { TemplateItem } from '../template/template.item';
import { GameCategoryItem } from './game.category.item';


export class GameListItem extends CommonTreeItem<TemplateItem> {
  public contextValue = 'games';
  public jpath = '$.games';
  public iconPath = new vscode.ThemeIcon('symbol-operator', App.Colors.GamesIcon);

  constructor(
    public readonly context: CommonTreeItemContext,
    public title: string = 'games',
    public readonly command?: vscode.Command
  ) {
    super(title, vscode.TreeItemCollapsibleState.Collapsed);
  }

  public async getItems() {
    const context = { ...this.context, parent: this };

    return this.app.GameCategoryList
      .sort((a, b) => a.ID - b.ID)
      .map((row) => new GameCategoryItem(context, row));
  }
}