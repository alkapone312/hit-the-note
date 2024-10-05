import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import tsdoc from 'eslint-plugin-tsdoc';

export default tseslint.config({
    plugins: {
        'tsdoc': tsdoc
    },
    files: ['src/**/*.ts', 'src/*.ts'],
    extends: [
      eslint.configs.strict,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],
    rules: {
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-extraneous-class': 'off'
    }
  })