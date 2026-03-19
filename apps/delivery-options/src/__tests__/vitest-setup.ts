import {afterEach} from 'vitest';
import {resetBroadCapabilities} from '../composables/useBroadCapabilities';

afterEach(() => {
  resetBroadCapabilities();
});
