import * as vscode from 'vscode';
import { App } from '../../../app';
import { CommonTreeItem, CommonTreeItemContext } from '../common.item';
import GameListItem from '../game/game.list.item';
import type { TemplateListItem } from './template.list.item';
import jp from 'jsonpath/jsonpath.js';
import { TextDecoder } from 'util';

const fs = vscode.workspace.fs


export class TemplateItem<P = TemplateListItem> extends CommonTreeItem<P>  {
  public static Commands = {
    OpenTemplate: App.Commands.OpenFile
  };

  public contextValue = 'template';
  public iconPath = new vscode.ThemeIcon('json', App.Colors.TemplateIcon);
  public json!: object;

  constructor(
    public readonly context: CommonTreeItemContext,
    public readonly id: string,
    public readonly originUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super(id, vscode.TreeItemCollapsibleState.Collapsed);

    this._readjson();
  }

  public async getItems() {
    const context = { ...this.context, parent: this, template: this };

    return [new GameListItem(context)];
  }

  public readjson() {
    return fs.readFile(this.originUri).then((buf) => {
      return JSON.parse(new TextDecoder('utf-8').decode(buf));
    });
  }

  public _readjson() {
    return this.readjson().then(json => this.json = json);
  }

  public get() {
    return jp.value();
  }

  public showTextDocument() {
    vscode.window.showTextDocument(this.originUri);
  }
}