// import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
console.log('VUE', vue);

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern',
        },
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // Tell Vite that all components starting with "syphon-" are web components
            isCustomElement: (tag) => tag.startsWith('syphon-'),
          },
        },
      }),
    ],
  },
});
