import { writable } from 'svelte/store';
import type { SlotGameEquipped } from '@/common/game.common';
import { createSrc } from '@/src/stores/common.store';

export const slot = createSlot();
export const slotSrc = createSrc(slot);

function createSlot() {
  const { subscribe, set, update } = writable<SlotGameEquipped>({
    title: '',
    image: null,
    GameCategory: null,
    GamePlatform: null,
    GameCode: null,
    url: '',
    isHot: false,
    enable: false
  });

  return {
    subscribe,
    set: (val: SlotGameEquipped) => set(val),
    setImage: (val: any) => update(g => ({ ...g, image: val })),
  };
}

