import {nextTick} from 'vue';
import {describe, it, vi, expect} from 'vitest';
import {noop} from '@vueuse/core';
import {computedAsync} from './computedAsync';

describe('computedAsync', () => {
  it('returns a ref with a loading property', async () => {
    expect.assertions(1);

    const ref = computedAsync(() => Promise.resolve(1));

    await nextTick();

    expect(ref.loading.value).toBe(false);
  });

  it('sets loading to true when the promise is pending', async () => {
    expect.assertions(1);

    const ref = computedAsync(() => new Promise(noop));

    await nextTick();

    expect(ref.loading.value).toBe(true);
  });

  it('sets loading to false when the promise resolves', async () => {
    expect.assertions(2);

    vi.useFakeTimers();

    const ref = computedAsync(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    });

    vi.advanceTimersByTime(500);
    await nextTick();
    expect(ref.loading.value).toBe(true);

    vi.runAllTimers();
    await nextTick();
    expect(ref.loading.value).toBe(false);
  });
});
