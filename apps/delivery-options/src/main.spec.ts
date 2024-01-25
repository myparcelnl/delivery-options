import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS} from './data';
import {createDiv, dispatchEvent} from './__tests__';

describe.todo('main', () => {
  const unmountSpy: MockInstance = vi.fn();
  const mountSpy: MockInstance = vi.fn();

  beforeEach(async () => {
    mountSpy.mockImplementation((selector: string): void => {
      const element = document.querySelector<HTMLDivElement>(selector)!;

      element.__vue_app__ = {unmount: unmountSpy};
    });

    vi.doMock('vue', async (importOriginal) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      const actual = await importOriginal<typeof import('vue')>();

      return {
        ...actual,
        createApp: () => ({
          use: vi.fn(),
          mount: mountSpy,
          unmount: unmountSpy,
        }),
      };
    });

    await import('./main');

    createDiv();
    createDiv('test');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it.each([
    ['using Event', undefined],
    ['using CustomEvent', {selector: '#test'}],
  ])(`creates app once when ${UPDATE_DELIVERY_OPTIONS} is dispatched %s`, async (_, detail) => {
    expect.assertions(2);

    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, detail);
    expect(mountSpy).toHaveBeenCalledTimes(1);

    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, detail);
    expect(mountSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['using Event', undefined],
    ['using CustomEvent', {selector: '#test'}],
  ])(`creates app when ${RENDER_DELIVERY_OPTIONS} is dispatched %s`, async (_, detail) => {
    expect.assertions(4);

    await dispatchEvent(RENDER_DELIVERY_OPTIONS, detail);
    expect(mountSpy).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(0);

    await dispatchEvent(RENDER_DELIVERY_OPTIONS, detail);
    expect(mountSpy).toHaveBeenCalledTimes(2);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });
});
