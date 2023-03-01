module.exports = {
  root: true,
  overrides: [
    {
      files: ['./**/index.js'],
      plugins: ['sort-exports'],
      rules: {
        'sort-exports/sort-exports': ['warn', {sortDir: 'asc', sortExportKindFirst: 'type'}],
      },
    },
    {
      files: ['./**/*.vue'],
      extends: '@myparcel-eslint/eslint-config-prettier-typescript-vue',
      rules: {
        '@typescript-eslint/no-misused-promises': 'off',
        'vue/html-self-closing': 'off',
        'vue/no-bare-strings-in-template': 'off',
        'vue/no-undef-components': [
          'error',
          {
            ignorePatterns: ['^Pdk(?:\\w)+$'],
          },
        ],
      },
    },
    {
      files: ['./**/*.ts', './**/*.tsx'],
      extends: '@myparcel-eslint/eslint-config-prettier-typescript',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        'class-methods-use-this': 'off',
      },
    },
    {
      files: ['./**/*.js', './**/*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['./**/*.js', './**/*.cjs', './**/*.mjs'],
      extends: [
        '@myparcel-eslint/eslint-config-node',
        '@myparcel-eslint/eslint-config-esnext',
        '@myparcel-eslint/eslint-config-prettier',
      ],
    },
    {
      files: ['./**/*.spec.*', './**/*.test.*', './**/__tests__/**', './**/*Test.*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        'max-len': 'off',
        'max-lines-per-function': 'off',
      },
    },
  ],
};
