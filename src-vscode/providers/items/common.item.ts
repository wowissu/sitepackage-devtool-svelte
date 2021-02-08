import type { TemplateItem } from '@/src-vscode/providers/items/template/template.item';
import * as vscode from 'vscode';
import type AppTreeProvider from '../provider';

export class CommonTreeItem<P = any> extends vscode.TreeItem {
  public readonly context!: {
    parent: P,
    provider: AppTreeProvider,
    template?: TemplateItem<P>
  };

  public async getItems(): Promise<CommonTreeItem[]> {
    return [];
  }

  get parent() {
    return this.context.parent;
  }

  get app() {
    return this.context.provider.app;
  }

  get provider() {
    return this.context.provider;
  }
}


export type CommonTreeItemContext = CommonTreeItem['context'];