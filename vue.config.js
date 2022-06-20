const { deliveryOptionsConfig } = require('./private/deliveryOptionsConfig.js');
const path = require('path');
const { sandboxConfig } = require('./private/sandboxConfig.js');
const webpack = require('webpack');
const { deliveryOptionsLibConfig } = require('./private/deliveryOptionsLibConfig.js');
const { repository } = require('./package.json');

process.env.VITE_REPOSITORY_URL = repository.url.replace('.git', '');
process.env.VITE_COMMIT_HASH = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const {
  NODE_ENV,
  VITE_CLASS_BASE,
  VITE_COMMIT_HASH,
  VITE_REPOSITORY_URL,
} = process.env;

/**
 * @type {import("@vue/cli-service").ProjectOptions}
 */
module.exports = {
  publicPath: NODE_ENV === 'production'
    ? '/delivery-options/'
    : '/',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    writeToDisk: true,
    disableHostCheck: true,
  },

  css: {
    sourceMap: NODE_ENV === 'development',
    extract: false,
    loaderOptions: {
      sass: {
        additionalData: `$classBase: '${VITE_CLASS_BASE}';`,
      },
    },
  },

  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        '@': path.join(__dirname, 'src/'),
        '@Tests': path.join(__dirname, 'tests/'),
        '@Mocks': path.join(__dirname, 'tests/__mocks__/'),
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        VITE_CLASS_BASE: JSON.stringify(VITE_CLASS_BASE),
        VITE_COMMIT_HASH: JSON.stringify(VITE_COMMIT_HASH),
        VITE_REPOSITORY_URL: JSON.stringify(VITE_REPOSITORY_URL),
      }),
    ],
  },

  pluginOptions: {
    configureMultiCompilerWebpack: [
      sandboxConfig,
      deliveryOptionsConfig,
      deliveryOptionsLibConfig,
    ],
  },
};
