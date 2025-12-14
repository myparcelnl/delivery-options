module.exports = {
  root: true,
  overrides: [
    {
      files: ['./**/index.ts'],
      plugins: ['sort-exports'],
      rules: {
        'sort-exports/sort-exports': [
          'warn',
          {
            sortDir: 'asc',
            sortExportKindFirst: 'type',
          },
        ],
      },
    },
    {
      extends: ['@myparcel-dev/eslint-config-prettier-typescript-vue', '@myparcel-dev/eslint-config-import'],
      files: ['./**/*.vue'],
      rules: {
        '@typescript-eslint/no-misused-promises': 'off',
        // Disabled because import messes with multiple component blocks, like when using script setup and inheritAttrs.
        'import/first': 'off',
        'vue/html-self-closing': 'off',
        'vue/no-bare-strings-in-template': 'off',
        // Disabled because @typescript-eslint freaks out when there is no component block
        'vue/no-empty-component-block': 'off',
        'vue/no-undef-components': ['error', { ignorePatterns: ['story', 'variant'] }],
        'vue/no-setup-props-destructure': 'off',
        // Disabled because this is not relevant for typescript 4.5+
        'import/consistent-type-specifier-style': ['off'],
        'id-length': ['warn', { exceptions: ['_', 'i', 'j', 'k', 'v', 'x', 'y', 'z', 'L'] }],
        'no-bitwise': 'off',
      },
    },
    {
      files: ['./**/*.ts', './**/*.tsx'],
      extends: ['@myparcel-dev/eslint-config-prettier-typescript', '@myparcel-dev/eslint-config-import'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        'class-methods-use-this': 'off',
        // Disabled because this is not relevant for typescript 4.5+
        'import/consistent-type-specifier-style': ['off'],
        'id-length': ['warn', { exceptions: ['_', 'i', 'j', 'k', 'v', 'x', 'y', 'z', 'L'] }],
        'no-bitwise': 'off',
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
        '@myparcel-dev/eslint-config-node',
        '@myparcel-dev/eslint-config-esnext',
        '@myparcel-dev/eslint-config-prettier',
        '@myparcel-dev/eslint-config-import',
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
