module.exports = {
  root: true,
  extends: [
    '@myparcel-eslint/eslint-config-esnext',
    '@myparcel-eslint/eslint-config-prettier',
  ],
  overrides: [
    {
      'files': '**/*.vue',
      'extends': '@myparcel-eslint/eslint-config-prettier-vue',
      'rules': {
        'vue/no-undef-components': [
          'error',
          {
            'ignorePatterns': [
              'RecursiveForm',
              'BCard',
              'BDropdownItem',
              'BInputGroupPrepend',
              'BInputGroupText',
              'BNavItemDropdown',
              'BSpinner',
              'BTab',
              'BTabs',
            ],
          },
        ],
      },
    },
    {
      'files': [
        '**/*.cjs',
        '**/*.mjs',
      ],
      'extends': '@myparcel-eslint/eslint-config-node',
    },
    {
      'extends': '@myparcel-eslint/eslint-config-prettier-typescript',
      'files': [
        '**/*.ts',
      ],
    },
  ],
};
