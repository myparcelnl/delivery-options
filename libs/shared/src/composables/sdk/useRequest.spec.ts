import {toValue} from 'vue';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useRequestStorage} from './useRequestStorage';
import {useRequest} from './useRequest';

describe('useRequest', () => {
  const useTestQuery = () => {
    return useRequest(['test'], async () => {
      return new Promise((resolve) => {
        setTimeout((): void => {
          resolve('tada');
        }, 1000);
      });
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    useRequestStorage.clear();
    useRequest.clear();
  });

  it('waits for async result', () => {
    const query = useTestQuery();

    expect(toValue(query.data)).toBe(null);
    expect(toValue(query.loading)).toBe(true);

    expect(query.load()).toBeInstanceOf(Promise);
  });

  it('gets async result', async () => {
    expect.assertions(4);
    const query = useTestQuery();

    await vi.runAllTimersAsync();

    expect(toValue(query.data)).toBe('tada');
    expect(toValue(query.loading)).toBe(false);
    await expect(query.load()).resolves.toBe(undefined);

    // Ensure that the result is cached:
    const query2 = useTestQuery();
    expect(toValue(query2.data)).toBe('tada');
  });

  it('uses onSuccess callback', async () => {
    expect.assertions(2);

    const onSuccess = vi.fn();
    useRequest(['test'], () => 'beep', {onSuccess});

    expect(onSuccess).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();

    expect(onSuccess).toHaveBeenCalledWith('beep');
  });
});
