import { TemplateItem } from './template.item';
import * as vscode from 'vscode';
import type { CommonTreeItemContext } from '../common.item';
import _ from 'lodash';
import SlotPlatformItem from '../slot/slot.platform.item';
import { App } from '@/src-vscode/app';

export class TemplateSlotsItem<P> extends TemplateItem<P>  {
  public static contextValue = 'slots';
  public iconPath = new vscode.ThemeIcon('symbol-operator', App.Colors.GamesIcon);

  constructor(
    public readonly context: CommonTreeItemContext,
    public readonly originUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super(context, TemplateSlotsItem.contextValue, originUri, command);
  }

  public async getItems() {
    const context = { ...this.context, parent: this, template: this };
    const slotGameCategory = 2;
    const slots = _.filter(this.app.SlotGameEqList, { GameCategory: slotGameCategory })
    const platformMap = this.app.GamePlatformMap;

    return _.uniqBy(slots, 'GamePlatform').map(row => new SlotPlatformItem(context,  platformMap[row.GamePlatform]));
  }
}