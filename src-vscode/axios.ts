import * as vscode from 'vscode';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { GameCategory, GamePlatform, GamePlatformCategory, GamePlatformCategoryEquipped, WebsitePattern } from '@/common/game.common';
import { useMock } from './axios.mock';

export class BackstageApi {
  public axios!: AxiosInstance;

  public url = {
    GetCommonData: '/api/Developer/GetCommonData'
  };

  constructor(public baseURL: string) {
    this.axios = this.newInstance({
      baseURL
    });

    this.axios.interceptors.response.use(undefined, (err: AxiosError) => {
      vscode.window.showErrorMessage(`BackstageApi: ${err.message} in ${err.request.url}`);
    });

    useMock(this);
  }

  public newInstance(opt: AxiosRequestConfig) {
    return axios.create({
      timeout: 600000,
      ...opt
    });
  }

  public getCommonData() {
    return this.axios.post<{
      'WebsitePatternList': WebsitePattern[],
      'GamePlatformCategoryList': GamePlatformCategory[],
      'GamePlatformList': GamePlatform[],
      'GameCategoryList': GameCategory[]
    }>(this.url.GetCommonData).then((res) => {
      const { GameCategoryList, GamePlatformList, GamePlatformCategoryList } = res.data;

      const GameCategoryMap = GameCategoryList.reduce<Record<number, GameCategory>>((acc, row) => {
        acc[row.ID] = row;
        return acc;
      }, {});

      const GamePlatformMap = GamePlatformList.reduce<Record<number, GamePlatform>>((acc, row) => {
        acc[row.ID] = row;
        return acc;
      }, {});

      const list = GamePlatformCategoryList.map<GamePlatformCategoryEquipped>((row) => {
        if (GameCategoryMap[row.GameCategory] === undefined) {
          vscode.window.showErrorMessage('GameCategory.ID: "%s" not found in GameCategoryList.', row.GameCategory.toString());
        }

        if (GamePlatformMap[row.GamePlatform] === undefined) {
          vscode.window.showErrorMessage('GamePlatform.ID: "%s" not found in GamePlatformList.', row.GamePlatform.toString());
        }

        return {
          id: `C${row.GameCategory}P${row.GamePlatform}`,
          title: '',
          image: '',
          ...row,
          GameCategoryKey: GameCategoryMap[row.GameCategory]?.Key,
          GamePlatformKey: GamePlatformMap[row.GamePlatform]?.Key
        };
      });

      return {
        GamePlatformCategoryList: list,
        GameCategoryMap,
        GamePlatformMap,
        GameCategoryList,
        GamePlatformList
      };
    });
  }
}