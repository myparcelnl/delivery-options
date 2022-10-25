import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],

  build: {
    lib: {
      name: 'MyParcelDeliveryOptionsShared',
      entry: './src/index.ts',
    },
    outDir: 'lib',
  },
});
