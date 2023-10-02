const { deliveryOptionsConfig } = require('./private/deliveryOptionsConfig.js');
const path = require('path');
const { sandboxConfig } = require('./private/sandboxConfig.js');
const webpack = require('webpack');
const { deliveryOptionsLibConfig } = require('./private/deliveryOptionsLibConfig.js');
const {
  repository,
  version,
} = require('./package.json');

process.env.REPOSITORY_URL = repository.url.replace('.git', '');
process.env.COMMIT_HASH = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();
process.env.VERSION = version;

const {
  NODE_ENV,
  CLASS_BASE,
  COMMIT_HASH,
  REPOSITORY_URL,
  VERSION,
} = process.env;

/**
 * @type {import('@vue/cli-service').ProjectOptions}
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
        additionalData: `$classBase: '${CLASS_BASE}';`,
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
        CLASS_BASE: CLASS_BASE,
        COMMIT_HASH: COMMIT_HASH,
        REPOSITORY_URL: REPOSITORY_URL,
        VERSION: VERSION,
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
