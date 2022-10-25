const webpack = require('webpack');
const kebabCase = require('lodash/kebabCase');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * @param {String} name - Name.
 * @param {String} slug - Slug to use for folders and such.
 * @param {webpack.Configuration} config - Config.
 *
 * @returns {webpack.Configuration}
 */
function createConfig(name, slug = null, config = {}) {
  slug = slug || kebabCase(name);

  // Destructure things we are inserting manually.
  const {
    plugins = [],
    output = {},
    ...configObject
  } = config;

  return {
    output: {
      filename: `${slug}.js`,
      ...output,
    },

    plugins: [
      new webpack.BannerPlugin(`MyParcel ${name}`),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'parsed',
        openAnalyzer: false,
        logLevel: 'info',
        reportFilename: `analysis/${slug}-report.html`,
      }),
      ...plugins,
    ],
    ...configObject,
  };
}

module.exports = { createConfig };
