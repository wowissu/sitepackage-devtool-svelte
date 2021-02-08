import * as vscode from 'vscode';
import { App } from '../../../app';
import type { GameCategory, GamePlatformCategoryEquipped } from '@/common/game.common';
import { CommonTreeItem } from '../common.item';
import type { GameListItem } from './game.list.item';
import { GamePlatformItem } from './game.platform.item';

export class GameCategoryItem<P = GameListItem> extends CommonTreeItem<P> {
  public contextValue = 'game.category';
  public iconPath = new vscode.ThemeIcon('bookmark', App.Colors.GameIcon);
  public platforms: GamePlatformCategoryEquipped[] = [];

  constructor(
    public readonly context: CommonTreeItem['context'],
    public gameCategory: GameCategory,
    public readonly command?: vscode.Command
  ) {
    super(gameCategory.Key, vscode.TreeItemCollapsibleState.Collapsed);

    this._filterPlatform();
    this.description = `(${this.platforms.length})`;
    this.tooltip = gameCategory.ID.toString();
  }

  public getItems() {
    const context = { ...this.context, parent: this };

    return Promise.resolve(this.platforms.map((row) => {
      return new GamePlatformItem(context, row);
    }));
  }

  private _filterPlatform() {
    this.platforms = this.app.GamePlatformCategoryList.filter(row => {
      return row.GameCategory === this.gameCategory.ID;
    });
  }
}
