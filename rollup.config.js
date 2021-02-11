import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

const sveltePlugins = [
  svelte({
    compilerOptions: {
      // enable run-time checks when not in production
      dev: !production
    },
    emitCss: true,
    preprocess: sveltePreprocess()
  }),
  // we'll extract any component CSS out into
  // a separate file - better for performance
  // css({ output: 'boundle.css' }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs
  resolve({
    browser: true,
    dedupe: ['svelte']
  }),

  // Watch the `public` directory and refresh the
  // browser on changes when not in production
  // !production && livereload('public'),
];

const commonPlugins = [
  json(),
  commonjs(),
  typescript(),

  // In dev mode, call `npm run start` once
  // the bundle has been generated
  !production && serve(),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser()
];

export default [
  ...['main', 'game', 'slot'].map(name => {
    return {
      input: `src/${name}.ts`,
      output: [
        {
          sourcemap: true,
          format: 'iife',
          name,
          file: `public/build/${name}.js`
        }
      ],
      plugins: [
        ...commonPlugins,
        ...sveltePlugins,
        css({ output: `${name}.css` })
      ],
      watch: {
        clearScreen: false
      }
    }
  }),
  {
    input: 'src-vscode/extension.ts',
    output: [
      {
        sourcemap: true,
        format: 'cjs',
        name: 'extension',
        dir: 'public/build'
      }
    ],
    external: ['vscode', 'fs'],
    plugins: [
      ...commonPlugins,
      resolve({
        browser: false,
        dedupe: ['axios', 'axios-mock-adapter', 'jsonpath']
      }),
    ],
    watch: {
      clearScreen: false
    }
  }
];
