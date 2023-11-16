import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {get} from '@vueuse/core';
import {useQueryClient} from './useQueryClient';
import {useQuery} from './useQuery';

describe('useQuery', () => {
  const mock = vi.fn().mockReturnValueOnce('tada');

  const useTestQuery = () => {
    return useQuery('test', async () => {
      return new Promise((resolve) => {
        setTimeout((): void => {
          resolve(mock());
        }, 1000);
      });
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    useQueryClient().reset();
  });

  it('waits for async result', () => {
    const query = useTestQuery();

    expect(get(query.data)).toBe(null);
    expect(get(query.loading)).toBe(true);

    expect(query.suspense()).toBeInstanceOf(Promise);
  });

  it('gets async result', async () => {
    expect.assertions(4);
    const query = useTestQuery();

    await vi.runAllTimersAsync();

    expect(get(query.data)).toBe('tada');
    expect(get(query.loading)).toBe(false);
    await expect(query.suspense()).resolves.toBe(undefined);

    // Ensure that the result is cached:
    const query2 = useTestQuery();
    expect(get(query2.data)).toBe('tada');
  });

  it('uses onSuccess callback', async () => {
    expect.assertions(2);

    const onSuccess = vi.fn();
    useQuery('test', () => 'beep', {onSuccess});

    expect(onSuccess).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();

    expect(onSuccess).toHaveBeenCalledWith('beep');
  });
});
