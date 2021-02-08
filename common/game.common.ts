export interface WebsitePattern {
  ID: number,
  Name: string,
  Enable: boolean
}

export interface GamePlatform {
  ID: number,
  Key: string
}

export interface GameCategory {
  ID: number,
  Key: string
}

export interface GamePlatformCategory {
  GamePlatform: GamePlatform['ID'],
  GameCategory: GameCategory['ID']
}

export interface GamePlatformCategoryEquipped extends GamePlatformCategory {
  id: string | null,
  title: string,
  image?: { require: string } | string,
  GameCategoryKey: GameCategory['Key'],
  GamePlatformKey: GamePlatform['Key'],
}