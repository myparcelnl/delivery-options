import * as Vue from 'vue';
import {afterEach, describe, it, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {waitForEvent} from '@myparcel-do/shared/testing';
import {KEY_ADDRESS, KEY_CONFIG} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getDefaultAddress} from './utils';
import {RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS, UPDATED_DELIVERY_OPTIONS} from './data';
import {getDefaultConfigForPlatform} from './config';

/**
 * @vitest-environment happy-dom
 */
const createWrapper = async (): Promise<void> => {
  await import('./main');

  const wrapper = document.createElement('div');

  wrapper.id = __CLASS_BASE__;

  document.body.appendChild(wrapper);
};

const dispatchEvent = async (event: string, detail?: unknown): Promise<void> => {
  const eventInstance = detail ? new CustomEvent(event, {detail}) : new Event(event);

  console.warn('dispatching event', event);
  document.dispatchEvent(eventInstance);

  await waitForEvent(UPDATED_DELIVERY_OPTIONS);
  await flushPromises();
};

describe('main', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it(`creates app once when ${UPDATE_DELIVERY_OPTIONS} is dispatched`, async ({expect}) => {
    expect.assertions(2);
    const createAppSpy = vi.spyOn(Vue, 'createApp');

    await createWrapper();

    window.MyParcelConfig = {
      [KEY_CONFIG]: getDefaultConfigForPlatform(PlatformName.MyParcel),
      [KEY_ADDRESS]: getDefaultAddress(),
    };

    await dispatchEvent(UPDATE_DELIVERY_OPTIONS);
    expect(createAppSpy).toHaveBeenCalledTimes(1);

    await dispatchEvent(UPDATE_DELIVERY_OPTIONS);
    expect(createAppSpy).toHaveBeenCalledTimes(1);
  });

  it(`creates app when ${RENDER_DELIVERY_OPTIONS} is dispatched`, async ({expect}) => {
    expect.assertions(2);
    const createAppSpy = vi.spyOn(Vue, 'createApp');

    await createWrapper();

    await dispatchEvent(RENDER_DELIVERY_OPTIONS);
    expect(createAppSpy).toHaveBeenCalledTimes(1);

    await dispatchEvent(RENDER_DELIVERY_OPTIONS);
    expect(createAppSpy).toHaveBeenCalledTimes(2);
  });
});
