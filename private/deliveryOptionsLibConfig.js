const { defaultDeliveryOptionsConfig } = require('./defaultDeliveryOptionsConfig.js');
const { createConfig } = require('./createConfig.js');

/**
 * This config does not include Vue itself in the build.
 *
 * @type {webpack.Configuration}
 */
const deliveryOptionsLibConfig = createConfig('Delivery Options (Requires vue@^2.6.0)', null, {
  ...defaultDeliveryOptionsConfig,
  output: {
    filename: 'myparcel.lib.js',
  },
  externals: {
    vue: 'Vue',
  },
});

module.exports = { deliveryOptionsLibConfig };
