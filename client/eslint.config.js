// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const unusedImports = require('eslint-plugin-unused-imports');
const unicorn = require('eslint-plugin-unicorn').default;
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

export default defineConfig([
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
      'unicorn': unicorn,
      'better-tailwindcss': betterTailwindcss,
    },
    processor: angular.processInlineTemplates,
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/tailwind-theme.css',
      },
    },
    rules: {
      'better-tailwindcss/no-unknown-class': 'warn',
      'better-tailwindcss/sort-class-names': 'warn',

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
      'better-tailwindcss/no-unknown-class': 'warn',
      'better-tailwindcss/sort-class-names': 'warn',
    },
  },
]);
