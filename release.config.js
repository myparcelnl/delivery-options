const { addGitPlugin, addGitHubPlugin } = require('@myparcel/semantic-release-config/src/plugins');
const baseConfig = require('@myparcel/semantic-release-config/npm');

module.exports = {
  ...baseConfig,
  branches: ['v5.x'],
  extends: '@myparcel/semantic-release-config/npm',
  plugins: [
    ...baseConfig.plugins,
    addGitHubPlugin(),
    addGitPlugin(),
  ],
};
