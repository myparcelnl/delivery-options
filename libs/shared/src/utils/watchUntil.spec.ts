import {ref, type Ref} from 'vue';
import {describe, it, vi, beforeEach, afterEach, expect, type Mock} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {type PromiseOr} from '@myparcel/ts-utils';
import {watchUntil} from './watchUntil';

describe('watchUntil', () => {
  let source: Ref;
  let callback: Mock<() => PromiseOr<void>>;

  beforeEach(() => {
    source = ref(false);
    callback = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it.each([
    ['true', true],
    ['1', 1],
    ['string', 'string'],
    ['filled array', [1, 2, 3]],
  ])('calls callback when source value is %s', async (_, value) => {
    expect.assertions(1);

    void watchUntil(source).then(callback);
    source.value = value;

    await flushPromises();

    expect(callback).toHaveBeenCalled();
  });

  it.each([
    ['false', false],
    ['0', 0],
    ['empty array', []],
  ])('does not call callback when source value is %s', async (_, value) => {
    expect.assertions(1);

    void watchUntil(source).then(callback);

    source.value = value;
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();
  });

  it('stops watching after callback is called', async () => {
    expect.assertions(2);

    void watchUntil(source).then(callback);

    source.value = 1;
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);

    source.value = 2;
    await flushPromises();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles condition function', async () => {
    expect.assertions(2);

    const condition = vi.fn((value) => value > 1);

    void watchUntil(source, {condition}).then(() => callback());

    source.value = 1;
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();

    source.value = 2;
    await flushPromises();

    expect(callback).toHaveBeenCalled();
  });
});
