import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginImport from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      'import': pluginImport
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
        'quotes': [2, 'single', { avoidEscape: true }],
        'no-multiple-empty-lines':['error',{ max:1 }],
        'no-duplicate-imports': ['error'],
        'unused-imports/no-unused-imports': 'error',
        'semi': ['error', 'always'],
        'import/no-duplicates': ['error', { 'prefer-inline': true }]

    },
  },
);
