import './boot';
import PlatformApp from './Platform.svelte';

const app = new PlatformApp({
  target: document.body
});

export default app;