import {afterEach} from 'vitest';
import {resetSharedCapabilities} from '../composables/useSharedCapabilities';

afterEach(() => {
  resetSharedCapabilities();
});
