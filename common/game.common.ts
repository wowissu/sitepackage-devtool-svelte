import type { SiteconfigImage } from './index';

export interface WebsitePattern {
  ID: number;
  Name: string;
  Enable: boolean;
}

export interface GamePlatform {
  ID: number;
  Key: string;
}

export interface GameCategory {
  ID: number;
  Key: string;
}

export interface GamePlatformCategory {
  GamePlatform: GamePlatform['ID'];
  GameCategory: GameCategory['ID'];
}

export interface GamePlatformCategoryEquipped extends GamePlatformCategory {
  id: string | null;
  title: string;
  image: SiteconfigImage;
  GameCategoryKey: GameCategory['Key'];
  GamePlatformKey: GamePlatform['Key'];
}

export interface SlotGame {
  GamePlatform: GamePlatform['ID'];
  GameCategory: GameCategory['ID'];
  GameCode: string;
  Enable: boolean;
}

export interface SlotGameEquipped extends Pick<SlotGame, 'GamePlatform' | 'GameCode' | 'GameCategory'> {
  title: string;
  url: string;
  image: SiteconfigImage;
  isHot: boolean;
  enable: false;
}