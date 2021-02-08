import './boot';
import MainApp from './Main.svelte';

const app = new MainApp({
  target: document.body
});

export default app;