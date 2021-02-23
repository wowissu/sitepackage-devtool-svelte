import { TemplateItem } from './template.item';
import * as vscode from 'vscode';
import type { CommonTreeItemContext } from '../common.item';
import GameCategoryItem from '@/src-vscode/providers/items/game/game.category.item';
import { App } from '@/src-vscode/app';

export class TemplateGamesItem<P> extends TemplateItem<P>  {
  public static contextValue = 'games';
  public iconPath = new vscode.ThemeIcon('symbol-operator', App.Colors.GamesIcon);

  constructor(
    public readonly context: CommonTreeItemContext,
    public readonly originUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super(context, TemplateGamesItem.contextValue, originUri, command);
  }

  public async getItems() {
    const context = { ...this.context, parent: this, template: this };

    return this.app.GameCategoryList
      .sort((a, b) => a.ID - b.ID)
      .map((row) => new GameCategoryItem(context, row));
  }
}