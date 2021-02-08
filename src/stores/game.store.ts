import { writable, derived } from 'svelte/store';
import type { GamePlatformCategoryEquipped } from '@/common/game.common';

export const game = createGame();
export const prefix = writable<string>('');
export const gameSrc = createGameSrc();

function createGame() {
  const { subscribe, set, update } = writable<GamePlatformCategoryEquipped>({
    id: null,
    title: '',
    image: null,
    GameCategory: null,
    GamePlatform: null,
    GameCategoryKey: '',
    GamePlatformKey: '',
  });

  return {
    subscribe,
    set: (val: GamePlatformCategoryEquipped) => set(val),
    setImage: (val: any) => update(g => ({ ...g, image: val })),
  };
}

function createGameSrc() {
  const defVal = '';

  return derived([game, prefix], ([$game, $prefix], set) => {
    if ($game && $game.image) {
      const src = (typeof $game.image === 'string' ? $game.image : $game.image?.require).replace('@siteconfig/', $prefix.endsWith('/') ? $prefix : `${$prefix}/`);
      console.log(src);
      set(src);
    } else {
      set(defVal);
    }
  }, defVal);
}