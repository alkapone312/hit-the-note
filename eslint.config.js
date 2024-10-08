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
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylistic,
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
        '@typescript-eslint/no-extraneous-class': 'off'
    }
  })