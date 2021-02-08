import * as vscode from 'vscode';
import { App } from '../../../app';
import { CommonTreeItem } from '../common.item';
import { TemplateItem } from './template.item';

const fs = vscode.workspace.fs;

export class TemplateListItem extends CommonTreeItem<undefined>  {
  public contextValue = 'templates';
  public iconPath = new vscode.ThemeIcon('list-tree', App.Colors.ListIcon);

  constructor(
    public readonly context: CommonTreeItem['context'],
    public readonly templateUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super('templates', vscode.TreeItemCollapsibleState.Collapsed);
  }

  public async getItems() {
    const context = { ...this.context, parent: this };

    return fs.readDirectory(this.templateUri).then((files) => {
      return files
        .filter(([fname, fstate]) => fstate === vscode.FileType.File)
        .map(([fname]) => new TemplateItem(context, fname, vscode.Uri.joinPath(this.templateUri, fname)));
    })
  }
}