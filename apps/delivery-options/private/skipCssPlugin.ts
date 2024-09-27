import {type Plugin, createLogger} from 'vite';

const PLUGIN_NAME = 'skip-css';
export const skipCssPlugin = (): Plugin => {
  const buildAnyway = Boolean(process.env.BUILD_CSS ?? false);

  const logger = createLogger(undefined, {prefix: PLUGIN_NAME});

  if (buildAnyway) {
    logger.info('Building CSS files because BUILD_CSS is set.');
  }

  return {
    name: PLUGIN_NAME,
    transform(_, id) {
      const isCssFile = id.endsWith('.scss') || id.endsWith('.css');

      if (buildAnyway || !isCssFile) {
        return null;
      }

      return '';
    },
  };
};
