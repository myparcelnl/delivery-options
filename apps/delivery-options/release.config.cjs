/* eslint-disable no-template-curly-in-string */
const {
  addChangelogPlugin,
  addCommitAnalyzerPlugin,
  addGitHubActionsOutputPlugin,
  addGitHubPlugin,
  addGitPlugin,
  addReleaseNotesGeneratorPlugin,
} = require('@myparcel/semantic-release-config/src/plugins');
const mainConfig = require('@myparcel/semantic-release-config');

/**
 * @type {import('semantic-release').Options}
 */
module.exports = {
  ...mainConfig,
  extends: 'semantic-release-monorepo',
  tagFormat: 'v${version}',
  plugins: [
    addCommitAnalyzerPlugin(),
    addGitHubActionsOutputPlugin(),
    addReleaseNotesGeneratorPlugin(),
    addChangelogPlugin(),
    addGitHubPlugin(),
    /*
     * Includes npm and git functionality
     */
    '@myparcel-do/semantic-release-plugin',
  ],
};
