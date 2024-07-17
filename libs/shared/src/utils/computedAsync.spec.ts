import {describe, it, vi, expect, beforeEach, afterEach} from 'vitest';
import {noop, promiseTimeout} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
import {computedAsync} from './computedAsync';

describe('computedAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a ref with a load method and a loading property', async () => {
    expect.assertions(3);

    const ref = computedAsync(() => Promise.resolve(1), 1);
    await flushPromises();

    expect(ref.value).toBe(1);
    expect(ref.loading.value).toBe(false);
    expect(ref.load).toBeDefined();
  });

  it('has a load method that starts the computation', async () => {
    expect.assertions(3);

    const ref = computedAsync(() => promiseTimeout(100), undefined, {immediate: false});

    expect(ref.loading.value).toBe(false);

    void ref.load();
    await flushPromises();
    expect(ref.loading.value).toBe(true);

    vi.runAllTimers();
    await flushPromises();

    expect(ref.loading.value).toBe(false);
  });

  it('sets loading to true when the promise is pending', async () => {
    expect.assertions(1);

    const ref = computedAsync(() => new Promise(noop), undefined, {immediate: true});

    await flushPromises();

    expect(ref.loading.value).toBe(true);
  });

  it('sets loading to false when the promise resolves', async () => {
    expect.assertions(2);

    vi.useFakeTimers();

    const ref = computedAsync(
      () => {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
      undefined,
      {immediate: true},
    );

    vi.advanceTimersByTime(500);
    await flushPromises();
    expect(ref.loading.value).toBe(true);

    vi.runAllTimers();
    await flushPromises();
    expect(ref.loading.value).toBe(false);
  });
});
