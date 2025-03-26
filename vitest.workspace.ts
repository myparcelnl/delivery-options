import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
  './apps/sandbox/vite.config.ts',
  './apps/delivery-options/vite-myparcel.config.ts',
  './apps/delivery-options/vite.config.ts',
  './apps/delivery-options/vite-myparcel-lib.config.ts',
  './libs/shared/vite.config.ts',
]);
