const { createConfig } = require('./createConfig.js');

const slug = 'sandbox';

/**
 * The Sandbox build. Has features like chunk splitting and favicons because it will actually be a web page.
 *
 * @type {webpack.Configuration}
 */
const sandboxConfig = createConfig('Delivery Options Sandbox', slug, {
  entry: '@/main.js',
  output: {
    filename: 'sandbox.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});

module.exports = { sandboxConfig };
