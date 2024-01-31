const {
  addCommitAnalyzerPlugin,
  addGitHubActionsOutputPlugin,
  addReleaseNotesGeneratorPlugin,
  addChangelogPlugin,
} = require('@myparcel/semantic-release-config/src/plugins/index.js');
const {addGitHubPlugin, addGitPlugin} = require('@myparcel/semantic-release-config/src/plugins');
const mainConfig = require('@myparcel/semantic-release-config/npm');

/**
 *
 * @type {import('semantic-release').Options}
 */
module.exports = {
  ...mainConfig,
  extends: '@myparcel/semantic-release-config/npm',
  plugins: [
    addCommitAnalyzerPlugin({
      preset: 'conventionalcommits',
      releaseRules: [{type: '*', scope: 'sandbox', release: false}],
    }),
    addGitHubActionsOutputPlugin(),
    addReleaseNotesGeneratorPlugin(),
    addChangelogPlugin(),
    addGitHubPlugin(),
    addGitPlugin(),
  ],
};
