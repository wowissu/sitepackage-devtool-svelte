import type { SiteconfigImage } from '@/common';
import type { GamePlatform } from '@/common/game.common';
import { writable, derived, Readable } from 'svelte/store';

export const prefix = writable<string>('');
export const platform = createPlatform();

export function createSrc<S extends { image: SiteconfigImage }>(target: Readable<S>) {
  const defVal = '';

  return derived([target, prefix], ([$target, $prefix], set) => {
    if ($target && $target.image) {
      const src = (typeof $target.image === 'string' ? $target.image : $target.image?.require).replace('@siteconfig/', $prefix.endsWith('/') ? $prefix : `${$prefix}/`);
      set(src);
    } else {
      set(defVal);
    }
  }, defVal);
}

function createPlatform(initVal: GamePlatform = { ID: null, Key: '' }) {
  const { subscribe, set } = writable<GamePlatform>(initVal);

  return {
    subscribe,
    set: (val: GamePlatform) => set(val),
  };
}