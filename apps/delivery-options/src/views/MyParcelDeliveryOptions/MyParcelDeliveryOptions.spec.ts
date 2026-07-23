import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render, waitFor, type RenderOptions, type RenderResult} from '@testing-library/vue';
import {CarrierSetting, ConfigSetting, KEY_CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName} from '@myparcel-dev/constants';
import {useResolvedDeliveryOptions, useSelectedValues} from '../../composables';
import {getMockDeliveryOptionsConfiguration} from '../../__tests__';
import MyParcelDeliveryOptions from './MyParcelDeliveryOptions.vue';

const renderDeliveryOptions = (options?: Partial<RenderOptions>): RenderResult => {
  return render(MyParcelDeliveryOptions, {
    global: {
      plugins: [createPinia(), ...(options?.global?.plugins ?? [])],
      ...options?.global,
    },
    ...options,
  });
};

describe('MyParcelDeliveryOptions.vue', () => {
  let errorSpy: MockInstance;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing and logs error if no config is passed', () => {
    const instance = renderDeliveryOptions();

    expect(errorSpy).toHaveBeenCalled();
    expect(instance.container.children[0].children).toHaveLength(0);
  });

  it.skip('boots if config is passed via prop', () => {
    const config = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {},
        },
      },
    });

    const instance = renderDeliveryOptions({props: {config}});

    expect(errorSpy).not.toHaveBeenCalled();
    expect(instance.container.children[0].children).toHaveLength(0);
  });

  it('renders CompactCarrierList when compactView=true and no carrier selected', async () => {
    const config = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [ConfigSetting.CompactView]: true,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });

    const {findByTestId, queryByTestId} = renderDeliveryOptions({
      props: {configuration: config},
    });
    await flushPromises();

    expect(await findByTestId('compact-carrier-list')).toBeTruthy();
    expect(queryByTestId('delivery-options-form')).toBeNull();
  });

  it('switches to DeliveryOptionsForm when carrier becomes defined', async () => {
    const config = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [ConfigSetting.CompactView]: true,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });

    const {findByTestId} = renderDeliveryOptions({props: {configuration: config}});
    await flushPromises();

    const {carrier} = useSelectedValues();
    carrier.value = CarrierName.PostNl;
    await flushPromises();

    expect(await findByTestId('delivery-options-form')).toBeTruthy();
  });

  // Regression test for INT-1679: a carrier with deliveryDaysWindow=0 skips the
  // delivery-options request on purpose. The empty result must not clear the
  // selected carrier, which in compact view bounces the user back to the
  // carrier overview before the dateless option can be shown.
  it('stays on DeliveryOptionsForm when the selected carrier has deliveryDaysWindow=0', async () => {
    const config = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [ConfigSetting.CompactView]: true,
        // Any truthy URL makes the capabilities pipeline run; the global fetch
        // stub ignores the URL value. Without it, delivery options never
        // resolve and this test would pass without exercising the bounce.
        [ConfigSetting.ProxyCapabilities]: 'https://example.test/proxyCapabilities',
        [CarrierSetting.PackageType]: PackageTypeName.Package,
        [CarrierSetting.DeliveryDaysWindow]: 3,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
            [CarrierSetting.DeliveryDaysWindow]: 0,
          },
        },
      },
    });

    const {findByTestId, queryByTestId} = renderDeliveryOptions({props: {configuration: config}});
    await flushPromises();

    const {carrier} = useSelectedValues();
    carrier.value = CarrierName.PostNl;
    await flushPromises();

    expect(await findByTestId('delivery-options-form')).toBeTruthy();

    // Wait until the (intentionally skipped) delivery-options resolution settles.
    const resolved = useResolvedDeliveryOptions();
    await waitFor(() => expect(resolved.loading.value).toBe(false));
    await flushPromises();

    expect(carrier.value).toBe(CarrierName.PostNl);
    expect(queryByTestId('delivery-options-form')).toBeTruthy();
    expect(queryByTestId('compact-carrier-list')).toBeNull();
  });
});
