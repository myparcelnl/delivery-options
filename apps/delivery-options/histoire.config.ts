import {defaultColors, defineConfig} from 'histoire';
import {HstVue} from '@histoire/plugin-vue';

export default defineConfig({
  // eslint-disable-next-line new-cap
  plugins: [HstVue()],
  setupFile: './histoire.setup.ts',
  defaultStoryProps: {
    layout: {
      type: 'grid',
      width: '100%',
    },
  },
  theme: {
    colors: {
      gray: defaultColors.zinc,
      primary: defaultColors.orange,
    },
  },
});
