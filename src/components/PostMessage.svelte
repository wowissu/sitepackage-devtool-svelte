<script lang="ts">
import { MsgEnum } from '@/common/message.common';
import { setContext } from 'svelte';

const msgs: Function[] = [];

const onMsg = function (on: Function) {
  msgs.push(on);
}

const triggerMsg = function (...args) {
  msgs.forEach((h) => h(...args));
}


setContext(MsgEnum.PlatformPostGame, {
  onMsg,
  triggerMsg
});
</script>
