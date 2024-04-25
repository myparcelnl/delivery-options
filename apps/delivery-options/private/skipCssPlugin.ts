import {type Plugin} from 'vite';

export const skipCssPlugin = (): Plugin => ({
  name: 'skip-css',
  transform(_, id) {
    if (id.endsWith('.scss') || id.endsWith('.css')) {
      return '';
    }

    return null;
  },
});
