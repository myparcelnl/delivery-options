import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {createPinia} from 'pinia';
import {render, type RenderOptions, type RenderResult} from '@testing-library/vue';
import {CarrierSetting, KEY_CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-do/shared';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import {CarrierName} from '@myparcel/constants';
import {getMockDeliveryOptionsConfiguration} from '../../__tests__';
import MyParcelDeliveryOptions from './MyParcelDeliveryOptions.vue';

const renderDeliveryOptions = (options?: Partial<RenderOptions>): RenderResult => {
  return render(MyParcelDeliveryOptions, {
    global: {
      plugins: [createPinia(), createMyParcelFormBuilderPlugin(), ...(options?.global?.plugins ?? [])],
      ...options?.global,
    },
    ...options,
  });
};

describe('MyParcelDeliveryOptions.vue', () => {
  let logSpy: MockInstance;
  let warnSpy: MockInstance;
  let errorSpy: MockInstance;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing and logs error if no config is passed', () => {
    const instance = renderDeliveryOptions();

    expect(errorSpy).toHaveBeenCalled();
    expect(instance.container.children).toHaveLength(0);
  });

  it.skip('boots if config is passed via prop', () => {
    const config = getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
          },
        },
      },
    });

    const instance = renderDeliveryOptions({props: {config}});

    expect(errorSpy).not.toHaveBeenCalled();
    expect(instance.container.children).toHaveLength(0);
  });
});
