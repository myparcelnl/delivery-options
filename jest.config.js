module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  // moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  // transform: {
  //   '^.+\\.vue$': 'vue-jest',
  //   '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  //   '^.+\\.js$': 'babel-jest',
  // },
  transformIgnorePatterns: [
    'node_modules/(?!('
    // + 'babel-jest|'
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
  // roots: [
  //   '<rootDir>/tests',
  // ],
  // snapshotSerializers: ['jest-serializer-vue'],
  // testMatch: [
  //   '<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
  // ],
  setupFilesAfterEnv: [
  //   '@testing-library/jest-dom',
    '<rootDir>/tests/jest-setup',
  ],
  // testURL: 'http://localhost/',
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.{js,vue}',
  // ],
  // coverageReporters: ['lcov', 'text-summary'],
};
