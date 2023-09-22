module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json',
      },
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['i18next', 'unused-imports'],
  rules: {
    // Common rules
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-restricted-imports': 'off',
    'no-underscore-dangle': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: '*', next: 'for' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
      { blankLine: 'always', prev: '*', next: 'cjs-export' },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'spaced-comment': ['error', 'always', { line: { markers: ['/'] } }],

    // eslint-plugin-import rules
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'pathGroups': [
          {
            pattern: '{next,next/*,react}',
            group: 'builtin',
            position: 'after',
          },
        ],
        'warnOnUnassignedImports': false,
        'pathGroupsExcludedImportTypes': ['builtin'],
      },
    ],

    // eslint-plugin-react
    'react/forbid-elements': ['error', { forbid: ['div'] }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['arrow-function'],
      },
    ],
    'react/jsx-handler-names': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    // eslint-plugin-unused-imports
    'unused-imports/no-unused-imports': 'error',

    // @typescript-eslint/eslint-plugin
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple',
      },
    ],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'next/link',
        message: 'Use `Link` component from `@chakra-ui/next-js` instead.',
      },
      {
        name: 'next/image',
        message: 'Use `Image` component from `@chakra-ui/react` instead.',
      },
    ],
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',

    // eslint-plugin-i18next
    'i18next/no-literal-string': 'warn',
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      },
    },
    {
      files: ['templates/**'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        // TODO: remove once storybook is configured
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
};
