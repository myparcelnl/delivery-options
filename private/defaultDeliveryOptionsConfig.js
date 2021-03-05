const defaultDeliveryOptionsConfig = {
  entry: '@/delivery-options/main.js',
  output: {
    filename: 'myparcel.js',
  },
  optimization: {
    splitChunks: false,
  },
};

module.exports = { defaultDeliveryOptionsConfig };
