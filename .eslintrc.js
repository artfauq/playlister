module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  ignorePatterns: ['eslintrc.js'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
  ],
  plugins: ['import', 'promise', 'unused-imports'],
  rules: {
    // Common rules
    // 'implicit-arrow-linebreak': 'off',
    // 'linebreak-style': ['error', 'unix'],
    // 'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    // 'newline-before-return': 'error',
    // 'no-process-exit': 'off',
    // 'object-curly-newline': 'off',
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

    // eslint-plugin-node
    // 'node/no-unsupported-features/es-syntax': ['error', { 'ignores': ['modules'] }],

    // eslint-plugin-import rules
    // 'import/no-cycle': 'off',
    'import/order': [
      'error',
      {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'groups': [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
      },
    ],
    'import/prefer-default-export': 'off',

    // @typescript-eslint/eslint-plugin rules
    // '@typescript-eslint/ban-ts-comment': 'off',
    // '@typescript-eslint/ban-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
    // '@typescript-eslint/restrict-template-expressions': 'off',

    // eslint-plugin-unused-imports
    'unused-imports/no-unused-imports': 'error',
  },
  root: true,
};
