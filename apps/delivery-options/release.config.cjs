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
    /*
     * Remove the workspace dependencies before npm publish because npm cannot handle workspace dependencies. The
     * version update and git commit are done in the prepare step, so the removed dependencies will not be committed.
     */
    [
      '@semantic-release/exec',
      {
        publishCmd: [
          'npm pkg delete "dependencies.@myparcel-do/shared"',
          'npm pkg delete "devDependencies.@myparcel-do/build-vite"',
        ].join(' && '),
      },
    ],
    addNpmPlugin(),
    addGitHubPlugin(),
    addGitPlugin(),
  ],
};
