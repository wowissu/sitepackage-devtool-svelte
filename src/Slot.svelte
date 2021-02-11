<script lang="ts">
import './messages/slot.msg';
import { onMount } from 'svelte';
import { Form, TextInput, FormGroup, Button, Header, SkipToContent, Content, Grid, Row, Column } from "carbon-components-svelte";
import { vscode } from './const/vscode.const';
import { MsgEnum } from '@/common/message.common';
import { slot, slotSrc } from './stores/slot.store';
import { platform } from './stores/common.store';

let isSideNavOpen = false;

onMount(async () => {
  // 通知後端 onmount
  vscode.postMessage({ command: MsgEnum.OnMount });
});

function onsubmit(event) {
  vscode.postMessage({
    command: MsgEnum.OnSubmit,
    slot: $slot,
  });
}

/** 通知vscode 開始檔案上傳 */
function showSaveDialog() {
  vscode.postMessage({
    command: MsgEnum.ShowSaveDialog,
    filename: $slot.GameCode
  });
}

</script>

<Header company={$platform.Key} platformName={$slot.GameCode} bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
</Header>

<Content>
  {JSON.stringify($slot)}
  <Grid>
    <Row>
      <Column aspectRatio="4x3" >
        <div class="image" style="background-image: url({$slotSrc});" />
      </Column>
      <Column>
        <Form on:submit={onsubmit}>
          <Row>
            <Column>
              <FormGroup legendText="標題">
                <TextInput bind:value={$slot.title} placeholder="Enter label..." required />
              </FormGroup>
              <FormGroup legendText="圖片">
                <Button on:click={showSaveDialog}>上傳</Button>
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Column>
          </Row>
        </Form>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
.image {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: #262626;
}
</style>