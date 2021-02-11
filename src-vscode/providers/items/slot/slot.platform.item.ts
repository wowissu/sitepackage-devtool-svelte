import * as vscode from 'vscode';
import { App } from '../../../app';
import type { GamePlatform, SlotGameEquipped } from '@/common/game.common';
import { CommonTreeItem } from '../common.item';
import type SlotListItem from './slot.list.item';
import SlotItem from './slot.item';
import _ from 'lodash';


export default class SlotPlatformItem<P = SlotListItem> extends CommonTreeItem<P> {
  public contextValue = 'slot.platform';
  public iconPath = new vscode.ThemeIcon('bookmark', App.Colors.GameIcon);

  constructor(
    public readonly context: CommonTreeItem['context'],
    public platform: GamePlatform,
    public readonly command?: vscode.Command
  ) {
    super(platform.Key, vscode.TreeItemCollapsibleState.Collapsed);
    this.description = `(${this.slots.length})`;
    this.tooltip = platform.ID.toString();
  }

  get slots() {
    return _.filter(this.app.SlotGameEqList, { GamePlatform: this.platform.ID });
  }

  public getItems() {
    const context = { ...this.context, parent: this };

    return Promise.resolve(this.slots.map(slot => new SlotItem(context, slot)));
  }
}
