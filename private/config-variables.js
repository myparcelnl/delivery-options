const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * @param {String} name - Name.
 * @param {String} slug - Slug to use for folders and such.
 * @param {webpack.Configuration} config - Config.
 *
 * @returns {webpack.Configuration}
 */
function createConfig(name, slug = null, config = {}) {
  slug = slug || name.toLowerCase().replace(/[^\w\d]/, '-');

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
      // eslint-disable-next-line vue/max-len,max-len
      new webpack.BannerPlugin(`MyParcel ${name} ${process.env.npm_package_version} [${process.env.npm_package_gitHead}]`),
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
