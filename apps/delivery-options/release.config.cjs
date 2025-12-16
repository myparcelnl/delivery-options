/* eslint-disable no-template-curly-in-string */
const path = require('node:path');
const {
  addChangelogPlugin,
  addCommitAnalyzerPlugin,
  addGitHubActionsOutputPlugin,
  addGitHubPlugin,
  addReleaseNotesGeneratorPlugin,
} = require('@myparcel-dev/semantic-release-config/src/plugins');
const mainConfig = require('@myparcel-dev/semantic-release-config');

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

    /*
     * Includes npm and git functionality
     */
    [
      '@myparcel-dev/do-semantic-release-plugin',
      {
        additionalPackages: [path.resolve(__dirname, '../../libs/shared')],
      },
    ],

    addGitHubPlugin(),
  ],
};
