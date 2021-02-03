const { defaultDeliveryOptionsConfig } = require('./defaultDeliveryOptionsConfig.js');
const { createConfig } = require('./createConfig.js');

/**
 * The base delivery options build. Includes all Vue code and compiles everything into one file.
 *
 * @type {webpack.Configuration}
 */
const deliveryOptionsConfig = createConfig('Delivery Options', null, defaultDeliveryOptionsConfig);

module.exports = { deliveryOptionsConfig };
