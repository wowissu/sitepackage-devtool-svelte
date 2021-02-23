import * as vscode from 'vscode';
import jp from 'jsonpath/jsonpath.js';
import { App } from '../../../app';
import type { SlotGameEquipped } from '@/common/game.common';
import { CommonTreeItem, CommonTreeItemContext } from '@/src-vscode/providers/items/common.item';
import type { TemplateItem } from '@/src-vscode/providers/items/template/template.item';
import { TextEncoder } from 'util';

const fs = vscode.workspace.fs

export default class SlotItem<P = TemplateItem> extends CommonTreeItem<P> {
  public targetUri!: vscode.Uri;
  public jpath!: string;
  public contextValue = 'slot';
  public iconPath = new vscode.ThemeIcon('symbol-misc', App.Colors.GameIcon);
  public readonly command = {
    command: App.Commands.OpenSlotWebview,
    title: '',
    arguments: [this]
  };

  constructor(
    public readonly context: CommonTreeItemContext,
    public slot: SlotGameEquipped,

  ) {
    super(`${slot.title || slot.GameCode}`, vscode.TreeItemCollapsibleState.None);

    this.tooltip = slot.GameCode;
    this.targetUri = context.template.originUri;
    this.jpath = jp.stringify(['$', 'slots', slot.GameCode]);

    // 訪問檔案中的 game
    this.slot = Object.assign({}, this.slot, jp.value(context.template.json, this.jpath));
  }

  public write(slot: SlotGameEquipped, target = this.targetUri, jpath = this.jpath) {
    return this.context.template.readjson().then((json) => {
      jp.value(json, jpath, slot);

      const reBuf = new TextEncoder().encode(JSON.stringify(json, null, 2));

      return fs.writeFile(target, reBuf).then(() => {
        this.slot = slot;
      });
    });
  }
}