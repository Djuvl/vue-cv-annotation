import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, 'src/components/Annotation.vue'),
      name: 'annotation',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    // dts({
    //   outputDir: 'tmp',
    //   copyDtsFiles: false,
    // }),
    vue(),
  ],
});
