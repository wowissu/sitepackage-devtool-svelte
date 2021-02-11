import { TemplateItem } from './template.item';
import type * as vscode from 'vscode';
import type { CommonTreeItemContext } from '../common.item';
import { basename } from 'path';
import SlotListItem from '../slot/slot.list.item';

export class TemplateSlotsItem<P> extends TemplateItem<P>  {
  constructor(
    public readonly context: CommonTreeItemContext,
    public readonly originUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super(context, basename(originUri.fsPath), originUri, command);
  }


  public async getItems() {
    const context = { ...this.context, parent: this, template: this };

    return [new SlotListItem(context)];
  }
}