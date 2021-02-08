import { MsgEnum } from '@/common/message.common';
import { game, prefix } from '../stores/game.store';

export const messageReceiver = ({ data: message }) => {
  commandHandler[message.command]?.(message);
};


window.addEventListener('message', messageReceiver);


const commandHandler = {
  [MsgEnum.PlatformPostGame](data) {
    console.log(JSON.stringify(data));
    game.set(data.game);
    prefix.set(data.prefix);
  },
  [MsgEnum.PlatformImageSaved]({ path }) {
    game.setImage(path);
  }
}