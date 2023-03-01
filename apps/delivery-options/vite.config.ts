import {createViteConfig} from '@myparcel-do/build-vite';
import vue from '@vitejs/plugin-vue';

export default createViteConfig({
  plugins: [vue()],
});
