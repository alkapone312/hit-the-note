import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import tsdoc from 'eslint-plugin-tsdoc';
import stylistic from '@stylistic/eslint-plugin-ts'

export default tseslint.config(
  {
    ignores: ['dist/*'],
  },
  {
    plugins: {
        'tsdoc': tsdoc
    },
    files: ['src/**/*.ts', 'src/*.ts'],
    extends: [
      eslint.configs.strictTypeChecked,
      stylistic.configs['all-flat'],
      ...tseslint.configs.all,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/class-methods-use-this': 'off',
        '@typescript-eslint/parameter-properties': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/max-params': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/method-signature-style': ['error', 'method'],
        '@stylistic/ts/function-call-spacing': ['error', 'never'],
        '@stylistic/ts/func-call-spacing': ['error', 'never'],
        '@stylistic/ts/space-before-function-paren': ['error', 'never'],
        '@stylistic/ts/quotes': ['error', 'single'],
        '@stylistic/ts/quote-props': ['error', 'consistent-as-needed'],
    },
  })