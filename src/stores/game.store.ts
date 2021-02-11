import { writable, derived } from 'svelte/store';
import type { GamePlatformCategoryEquipped } from '@/common/game.common';
import { createSrc } from '@/src/stores/common.store';

export const game = createGame();
export const prefix = writable<string>('');
export const gameSrc = createSrc(game);

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