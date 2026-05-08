import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {createPinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render, type RenderOptions, type RenderResult} from '@testing-library/vue';
import {CarrierSetting, ConfigSetting, KEY_CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useSelectedValues} from '../../composables';
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
            [CarrierSetting.AllowDeliveryOptions]: true,
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
            [CarrierSetting.AllowDeliveryOptions]: true,
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
});
