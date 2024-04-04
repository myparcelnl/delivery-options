import {type Plugin} from 'vite';

export const skipScssPlugin = (): Plugin => ({
  name: 'skip-scss',
  transform(_, id) {
    if (id.endsWith('.scss')) {
      return '';
    }

    return null;
  },
});
