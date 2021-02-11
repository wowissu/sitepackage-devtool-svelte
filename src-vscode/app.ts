import * as vscode from 'vscode';
import { BackstageApi } from './axios';
import type { GameCategory, GamePlatform, GamePlatformCategoryEquipped, SlotGame, SlotGameEquipped } from '@/common/game.common';

export const colors = {
  TemplateIcon: new vscode.ThemeColor('sitepackage.colors.templateIcon'),
  ListIcon: new vscode.ThemeColor('sitepackage.colors.listIcon'),
  GamesIcon: new vscode.ThemeColor('sitepackage.colors.gamesIcon'),
  GameIcon: new vscode.ThemeColor('sitepackage.colors.gameIcon')
};

enum Commands {
  OpenFile = 'extension.openFile',
  OpenGameWebview = 'extension.OpenGameWebview',
  OpenSlotWebview = 'extension.OpenSlotWebview'
}

export class App {
  public static Colors = colors;
  public static Commands = Commands;

  public ExtensionUri!: vscode.Uri;
  public workspaceRootUri = vscode.workspace.workspaceFolders![0].uri;
  public workspaceRootPath = this.workspaceRootUri!.fsPath;

  public cfg = vscode.workspace.getConfiguration();
  public templatesPath = this.cfg.get<string>('sitepackage.templatesPath')!;
  public siteconfigPath = this.cfg.get<string>('sitepackage.siteconfigPath')!;
  public bgApi = new BackstageApi('http://10.20.101.2:1688/');
  public GamePlatformCategoryList: GamePlatformCategoryEquipped[] = [];
  public GamePlatformList: GamePlatform[] = [];
  public GameCategoryList: GameCategory[] = [];
  public GamePlatformMap: Record<GamePlatform['ID'], GamePlatform> = {};
  public GameCategoryMap: Record<GameCategory['ID'], GameCategory> = {};
  public SlotGameList: SlotGame[] = [];
  public SlotGameEqList: SlotGameEquipped[] = [];
  public SlotGameEqMap: Record<SlotGameEquipped['GameCode'], SlotGameEquipped> = {};

  public Slots

  constructor(public extContext: vscode.ExtensionContext) {
    this.ExtensionUri = extContext.extensionUri;

    if (!this.workspaceRootUri) {
      vscode.window.showErrorMessage('No work in empty workspace');
      throw new Error();
    }
  }

  public init() {
    return this.injectCommonData();
  }

  public resolveExtensionUri(...p: string[]) {
    return vscode.Uri.joinPath(this.ExtensionUri, ...p);
  }

  public resolvePublicUri(...p: string[]) {
    return this.resolveExtensionUri('public', ...p);
  }

  public resolveRootUri(...p: string[]) {
    return vscode.Uri.joinPath(this.workspaceRootUri, ...p);
  }

  public resolveSiteconfigUri(...p: string[]) {
    return this.resolveRootUri(this.siteconfigPath, ...p);
  }

  public resolveTemplatesUri(...p: string[]) {
    return this.resolveSiteconfigUri('templates', ...p);
  }

  public resolveImageUri(...p: string[]) {
    return this.resolveTemplatesUri('images', ...p);
  }

  public resolveCommonUri(...p: string[]) {
    return this.resolveTemplatesUri('common', ...p);
  }

  public injectCommonData() {
    return this.bgApi.getCommonData().then((data) => {
      this.GamePlatformMap = data.GamePlatformMap;
      this.GameCategoryMap = data.GameCategoryMap;
      this.GamePlatformCategoryList = data.GamePlatformCategoryList;
      this.GamePlatformList = data.GamePlatformList;
      this.GameCategoryList = data.GameCategoryList;
      this.SlotGameList = data.SlotGameList;
      this.SlotGameEqList = data.SlotGameEqList;
      this.SlotGameEqMap = data.SlotGameEqMap;
    });
  }
}