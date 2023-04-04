/**
 * @type {webpack.Plugin}
 */
const onlyEmitJsPlugin = {
  apply(compiler) {
    compiler.hooks.emit.tap('DeleteHtmlPlugin', (compilation) => {
      const { assets } = compilation;
      const assetNames = Object.keys(assets);

      assetNames.forEach((assetName) => {
        if (!assetName.endsWith('.js')) {
          delete assets[assetName];
        }
      });
    });
  },
};

const defaultDeliveryOptionsConfig = {
  entry: '@/delivery-options/main.js',
  output: {
    filename: 'myparcel.js',
  },
  optimization: {
    splitChunks: false,
  },
  plugins: [
    onlyEmitJsPlugin,
  ],
};

module.exports = { defaultDeliveryOptionsConfig };
