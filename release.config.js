const { addGitHubPlugin } = require('@myparcel/semantic-release-config/src/plugins/addGitHubPlugin');
const mainConfig = require('@myparcel/semantic-release-config');
const npmConfig = require('@myparcel/semantic-release-config/npm');

module.exports = {
  ...mainConfig,
  extends: '@myparcel/semantic-release-config/npm',
  plugins: [
    ...npmConfig.plugins,
    addGitHubPlugin(),
  ],
};
