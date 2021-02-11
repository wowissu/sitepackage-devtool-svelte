import * as vscode from 'vscode';
import jp from 'jsonpath/jsonpath.js';
import { App } from '../../../app';
import type { GamePlatformCategoryEquipped } from '@/common/game.common';
import type GameCategoryItem from './game.category.item';
import { CommonTreeItem, CommonTreeItemContext } from '@/src-vscode/providers/items/common.item';

const fs = vscode.workspace.fs

export default class GameItem<P = GameCategoryItem> extends CommonTreeItem<P> {
  public targetUri!: vscode.Uri;
  public jpath!: string;
  public contextValue = 'game.platform';
  public iconPath = new vscode.ThemeIcon('symbol-misc', App.Colors.GameIcon);
  public readonly command = {
    command: App.Commands.OpenGameWebview,
    title: '',
    arguments: [this]
  };

  constructor(
    public readonly context: CommonTreeItemContext,
    public game: GamePlatformCategoryEquipped,

  ) {
    super(game.GamePlatformKey, vscode.TreeItemCollapsibleState.None);

    this.tooltip = game.GamePlatform.toString();
    this.targetUri = context.template.originUri;
    this.jpath = `$.games.${game.id}`;

    // 訪問檔案中的 game
    this.game = Object.assign({}, this.game, jp.value(context.template.json, this.jpath));
  }

  public write(game: GamePlatformCategoryEquipped, target = this.targetUri, jpath = this.jpath) {
    return this.context.template.readjson().then((json) => {
      jp.value(json, jpath, game);

      const reBuf = new TextEncoder().encode(JSON.stringify(json, null, 2));

      return fs.writeFile(target, reBuf).then(() => {
        this.game = game;
      });
    });
  }
}