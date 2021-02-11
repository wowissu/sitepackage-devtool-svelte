import './boot';
import PlatformApp from './Game.svelte';

const app = new PlatformApp({
  target: document.body
});

export default app;