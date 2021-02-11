import type { GamePlatform, SlotGameEquipped } from '@/common/game.common';
import { MsgEnum } from '@/common/message.common';
import { slot } from '../stores/slot.store';
import { prefix, platform } from '../stores/common.store';

export const messageReceiver = ({ data: message }) => {
  msgHandler[message.command]?.(message);
};


window.addEventListener('message', messageReceiver);


const msgHandler = {
  [MsgEnum.PostData](data: { slot: SlotGameEquipped, prefix: string, platform: GamePlatform }) {
    slot.set(data.slot);
    prefix.set(data.prefix);
    platform.set(data.platform);
  },
  [MsgEnum.ImageSaved]({ path }) {
    slot.setImage(path);
  }
}