import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {
  KEY_CONFIG,
  KEY_STRINGS,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  KEY_ADDRESS,
  PACKAGE_TYPE_SMALL,
  KEY_PLATFORM_CONFIG,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS} from './data';
import {createDiv, dispatchEvent, getMockDeliveryOptionsConfiguration} from './__tests__';

describe('main', () => {
  const unmountSpy: MockInstance = vi.fn();
  const mountSpy: MockInstance = vi.fn();

  beforeEach(async () => {
    document.body.innerHTML = '';

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

    expect(global.window.MyParcelConfig).toBeDefined();
    expect(Object.keys(global.window.MyParcelConfig)).toEqual([
      KEY_ADDRESS,
      KEY_CONFIG,
      KEY_STRINGS,
      KEY_PLATFORM_CONFIG,
    ]);
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
