import * as vscode from 'vscode';
import { App } from '../../../app';
import { CommonTreeItem, CommonTreeItemContext } from '../common.item';
import type { TemplateItem } from '../template/template.item';
import _ from 'lodash';
import SlotPlatformItem from './slot.platform.item';


export default class SlotListItem extends CommonTreeItem<TemplateItem> {
  public contextValue = 'slots';
  public iconPath = new vscode.ThemeIcon('symbol-operator', App.Colors.GamesIcon);

  constructor(
    public readonly context: CommonTreeItemContext,
    public title: string = 'slots',
    public readonly command?: vscode.Command
  ) {
    super(title, vscode.TreeItemCollapsibleState.Collapsed);
  }

  public async getItems() {
    const context = { ...this.context, parent: this };
    const slotGameCategory = 2;
    const slots = _.filter(this.app.SlotGameEqList, { GameCategory: slotGameCategory })
    const platformMap = this.app.GamePlatformMap;

    return _.uniqBy(slots, 'GamePlatform').map(row => new SlotPlatformItem(context,  platformMap[row.GamePlatform]));
  }
}