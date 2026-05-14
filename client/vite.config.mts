import { defineConfig } from 'vite';

import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig(({ mode }) => ({
  plugins: [angular(), viteTsConfigPaths()],
  // test: {
  //   globals: true,
  //   setupFiles: ['src/test-setup.ts'],
    
  //   include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  //   reporters: ['default'],
    
  //   browser: {
  //     enabled: true,
  //     headless: true,
  //     provider: playwright(),
  //     instances: [{ browser: 'chromium' }],
  //   },
  // },
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts}'],
    reporters: ['default'],
    environment: 'jsdom',
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/core/testing',
      '@angular/router',
      '@angular/compiler',
      '@analogjs/vitest-angular/setup-snapshots',
      '@analogjs/vitest-angular/setup-testbed',
    ],
  },
}));
