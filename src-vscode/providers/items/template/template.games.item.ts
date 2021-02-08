import { TemplateItem } from './template.item';
import type * as vscode from 'vscode';
import type { CommonTreeItemContext } from '../common.item';

export class TemplateGamesItem<P> extends TemplateItem<P>  {
  constructor(
    public readonly context: CommonTreeItemContext,
    public readonly originUri: vscode.Uri,
    public readonly command?: vscode.Command
  ) {
    super(context, 'siteconfig.games.json', originUri, command);
  }
}