import * as vscode from 'vscode';
import { App } from '../../../app';
import type { GameCategory, GamePlatformCategoryEquipped } from '@/common/game.common';
import { CommonTreeItem } from '../common.item';
import type GameListItem from './game.list.item';
import GameItem from './game.platform.item';

export default class GameCategoryItem<P = GameListItem> extends CommonTreeItem<P> {
  public contextValue = 'game.category';
  public iconPath = new vscode.ThemeIcon('bookmark', App.Colors.GameIcon);
  private _filterFn = row => row.GameCategory === this.gameCategory.ID;

  constructor(
    public readonly context: CommonTreeItem['context'],
    public gameCategory: GameCategory,
    public readonly command?: vscode.Command
  ) {
    super(gameCategory.Key, vscode.TreeItemCollapsibleState.Collapsed);

    this.description = `(${this.games.length})`;
    this.tooltip = gameCategory.ID.toString();
  }

  get games() {
    return this.app.GamePlatformCategoryList.filter(this._filterFn);
  }

  public getItems() {
    const context = { ...this.context, parent: this };

    return Promise.resolve(this.games.map((row) => {
      return new GameItem(context, row);
    }));
  }
}
