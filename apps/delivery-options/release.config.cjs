const {
  addChangelogPlugin,
  addCommitAnalyzerPlugin,
  addGitHubActionsOutputPlugin,
  addGitHubPlugin,
  addGitPlugin,
  addNpmPlugin,
  addReleaseNotesGeneratorPlugin,
} = require('@myparcel/semantic-release-config/src/plugins');
const mainConfig = require('@myparcel/semantic-release-config');

/**
 * @type {import('semantic-release').Options}
 */
module.exports = {
  ...mainConfig,
  extends: 'semantic-release-monorepo',
  // eslint-disable-next-line no-template-curly-in-string
  tagFormat: 'v${version}',
  plugins: [
    addCommitAnalyzerPlugin(),
    addGitHubActionsOutputPlugin(),
    addReleaseNotesGeneratorPlugin(),
    addChangelogPlugin(),
    addNpmPlugin({npmPublish: false}),
    addGitHubPlugin(),
    addGitPlugin(),
    [
      '@semantic-release/exec',
      {
        publishCmd: [
          'npm pkg delete "dependencies.@myparcel-do/shared"',
          'npm pkg delete "devDependencies.@myparcel-do/build-vite"',
          'npm publish',
        ].join(' && '),
      },
    ],
  ],
};
