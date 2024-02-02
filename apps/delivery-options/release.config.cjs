const {
  addChangelogPlugin,
  addCommitAnalyzerPlugin,
  addGitHubActionsOutputPlugin,
  addGitHubPlugin,
  addGitPlugin,
  addNpmPlugin,
  addReleaseNotesGeneratorPlugin,
} = require('@myparcel/semantic-release-config/src/plugins');
const mainConfig = require('@myparcel/semantic-release-config/npm');

/**
 * Fixes "__dirname is not defined" error in semantic-release-monorepo.
 */
// eslint-disable-next-line no-underscore-dangle
global.__dirname = __dirname;

/**
 * @type {import('semantic-release').Options}
 */
module.exports = {
  ...mainConfig,
  extends: 'semantic-release-monorepo',
  // eslint-disable-next-line no-template-curly-in-string
  tagFormat: 'v${version}',
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
    addNpmPlugin(),
  ],
};
