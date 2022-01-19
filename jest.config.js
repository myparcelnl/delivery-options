module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: [
    'node_modules/(?!('
    + 'bootstrap-vue|'
    + 'lodash-es'
    + ')/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@Tests/(.*)$': '<rootDir>/tests/$1',
    '^@Mocks/(.*)$': '<rootDir>/tests/__mocks__/$1',
    '^!?raw-loader!(.*)': '<rootDir>/tests/__mocks__/raw-loader.js',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/tests/jest-setup',
  ],
};
