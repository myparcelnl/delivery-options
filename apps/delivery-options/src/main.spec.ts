import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  KEY_CONFIG,
  KEY_STRINGS,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  KEY_ADDRESS,
  PACKAGE_TYPE_SMALL,
  KEY_PLATFORM_CONFIG,
} from '@myparcel-dev/shared';
import {CarrierName} from '@myparcel-dev/constants';
import {RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS} from './data';
import {createDiv, dispatchEvent, getMockDeliveryOptionsConfiguration} from './__tests__';

vi.mock('./views/MyParcelDeliveryOptions/DeliveryOptionsForm/DeliveryOptionsForm.vue', () => ({
  default: {template: '<div />'},
}));

describe('main', () => {
  const unmountSpy: MockInstance = vi.fn();
  const mountSpy: MockInstance = vi.fn();
  const listeners: Array<{type: string; listener: EventListenerOrEventListenerObject}> = [];

  const originalAddEventListener = document.addEventListener;
  const originalRemoveEventListener = document.removeEventListener;

  beforeEach(async () => {
    // Spy on document.addEventListener to track listeners
    document.addEventListener = (type, listener, options) => {
      listeners.push({type, listener});
      return originalAddEventListener.call(document, type, listener, options);
    };

    document.removeEventListener = (type, listener, options) => {
      const index = listeners.findIndex((l) => l.type === type && l.listener === listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      return originalRemoveEventListener.call(document, type, listener, options);
    };

    document.body.innerHTML = '';

    await import('./main');

    createDiv();
    createDiv('test');
  });

  afterEach(async () => {
    // Remove all tracked listeners
    listeners.forEach(({type, listener}) => {
      originalRemoveEventListener.call(document, type, listener);
    });
    listeners.length = 0;

    // Restore original methods
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;

    const apps = document.querySelectorAll('[data-v-app]');
    
    // Unmount synchronously first
    apps.forEach((app) => {
      const parent = app.parentElement;
      if (parent && (parent as any).__vue_app__) {
        (parent as any).__vue_app__.unmount();
        delete (parent as any).__vue_app__;
      }
    });

    // Give Vue time to process unmount effects
    await flushPromises();
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    document.body.innerHTML = '';
    delete (global.window as any).MyParcelConfig;
    
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it.each([
    ['using Event', undefined],
    ['using CustomEvent', {selector: '#test'}],
  ])(`creates app once when ${UPDATE_DELIVERY_OPTIONS} is dispatched %s`, async (_, detail) => {
    expect.assertions(2);

    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, detail);
    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, detail);

    const selector = detail?.selector ?? '#myparcel-delivery-options';

    expect(document.querySelectorAll(selector)).toHaveLength(1);
    expect(document.querySelector(selector)?.hasAttribute('data-v-app')).toBeTruthy();
  });

  it('exposes config on window object after booting', async () => {
    expect.assertions(2);

    await dispatchEvent(
      UPDATE_DELIVERY_OPTIONS,
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowDeliveryOptions]: true,
              [CarrierSetting.AllowStandardDelivery]: true,
            },
          },
        },
      }),
    );

    await flushPromises();

    expect(global.window.MyParcelConfig).toBeDefined();
    expect(Object.keys(global.window.MyParcelConfig)).toEqual([KEY_ADDRESS, KEY_CONFIG, KEY_STRINGS]);
  });

  it('exposes config with small package on window object after booting', async () => {
    expect.assertions(2);

    const mockConfig = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });
    mockConfig.config.packageType = PACKAGE_TYPE_SMALL;
    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, mockConfig);

    await flushPromises();

    expect(global.window.MyParcelConfig).toBeDefined();
    expect(Object.keys(global.window.MyParcelConfig)).toEqual([KEY_ADDRESS, KEY_CONFIG, KEY_STRINGS]);
  });

  it('exposes platform config on window object when defined while booting', async () => {
    expect.assertions(2);

    const mockConfig = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
      [KEY_PLATFORM_CONFIG]: {
        carriers: [
          {
            name: CarrierName.PostNl,
          },
        ],
      },
    });
    await dispatchEvent(UPDATE_DELIVERY_OPTIONS, mockConfig);

    await flushPromises();

    expect(global.window.MyParcelConfig).toBeDefined();
    expect(Object.keys(global.window.MyParcelConfig)).toEqual([
      KEY_ADDRESS,
      KEY_CONFIG,
      KEY_STRINGS,
      KEY_PLATFORM_CONFIG,
    ]);
  });

  it.todo.each([
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
