// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import unicorn from 'eslint-plugin-unicorn';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: path.resolve(__dirname, 'src/styles/tailwind-theme.css'),
      },
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      'unused-imports': unusedImports,
      unicorn: unicorn,
      'better-tailwindcss': betterTailwindcss,
    },
    processor: angular.processInlineTemplates,

    rules: {
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/enforce-consistent-class-order': 'warn',

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'no-unused-vars': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/no-null': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    languageOptions: {
      parser: await import('@angular-eslint/template-parser'),
    },
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
    },
  },
  {
    ignores: ['.angular/**/*', 'dist/**/*', '**/node_modules/**', '**/*.scss', '**/*.css'],
  },
]);
