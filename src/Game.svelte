<script lang="ts">
import './messages/game.msg';
import { onMount } from 'svelte';
import { Form, TextInput, FormGroup, Button, Header, SkipToContent, Content, Grid, Row, Column } from "carbon-components-svelte";
import { vscode } from './const/vscode.const';
import { MsgEnum } from '@/common/message.common';
import { game, gameSrc } from './stores/game.store';

let isSideNavOpen = false;

onMount(async () => {
  // 通知後端 onmount
  vscode.postMessage({ command: MsgEnum.OnMount });
});

function onsubmit(event) {
  vscode.postMessage({
    command: MsgEnum.OnSubmit,
    game: $game,
  });
}

/** 通知vscode 開始檔案上傳 */
function showSaveDialog() {
  vscode.postMessage({
    command: MsgEnum.ShowSaveDialog,
    filename: $game.id
  });
}

</script>

<Header company={$game.GameCategoryKey} platformName={$game.GamePlatformKey} bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <!-- <HeaderNav>
    <HeaderNavItem href="/" text="Link 1" />
    <HeaderNavItem href="/" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
  </HeaderNav> -->
</Header>

<Content>
  <Grid>
    <Row>
      <Column aspectRatio="4x3" >
        <div class="image" style="background-image: url({$gameSrc});" />
      </Column>
      <Column>
        <Form on:submit={onsubmit}>
          <FormGroup legendText="標題">
            <TextInput bind:value={$game.title} placeholder="Enter title..." required />
          </FormGroup>
          <FormGroup legendText="圖片">
            <Button on:click={showSaveDialog}>上傳</Button>
          </FormGroup>

          <Button type="submit">Submit</Button>
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