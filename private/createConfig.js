const webpack = require('webpack');
const kebabCase = require('lodash/kebabCase');

/**
 * @param {string} name - Name.
 * @param {string} slug - Slug to use for folders and such.
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
      ...plugins,
    ],
    ...configObject,
  };
}

module.exports = { createConfig };
