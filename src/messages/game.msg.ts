import { MsgEnum } from '@/common/message.common';
import { game, prefix } from '../stores/game.store'

export const messageReceiver = ({ data: message }) => {
  msgHandler[message.command]?.(message);
};


window.addEventListener('message', messageReceiver);


const msgHandler = {
  [MsgEnum.PostData](data) {
    console.log(JSON.stringify(data));
    game.set(data.game);
    prefix.set(data.prefix);
  },
  [MsgEnum.ImageSaved]({ path }) {
    game.setImage(path);
  }
}