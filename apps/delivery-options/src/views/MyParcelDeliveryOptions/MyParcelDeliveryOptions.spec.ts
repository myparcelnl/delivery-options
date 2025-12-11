import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {createPinia} from 'pinia';
import {render, type RenderOptions, type RenderResult} from '@testing-library/vue';
import {CarrierSetting, KEY_CARRIER_SETTINGS, KEY_CONFIG, useLogger} from '@myparcel-dev/shared';
import {createMyParcelFormBuilderPlugin} from '@myparcel-dev/vue-form-builder';
import {CarrierName} from '@myparcel-dev/constants';
import {getMockDeliveryOptionsConfiguration} from '../../__tests__';
import MyParcelDeliveryOptions from './MyParcelDeliveryOptions.vue';

vi.mock('@myparcel-dev/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@myparcel-dev/shared')>();
  return {
    ...actual,
    useLogger: vi.fn(() => ({
      error: vi.fn(),
      debug: vi.fn(),
      deprecated: vi.fn(),
    })),
  };
});

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
  let errorSpy: MockInstance;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing and logs error if no config is passed', () => {
    const errorSpy = vi.fn();
    vi.mocked(useLogger).mockReturnValue({error: errorSpy, debug: vi.fn(), deprecated: vi.fn()} as any);

    const instance = renderDeliveryOptions();

    expect(errorSpy).toHaveBeenCalled();
    expect(instance.container.children[0].children).toHaveLength(0);
  });

  it('boots if config is passed via prop', () => {
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
    expect(instance.container.children[0].children).toHaveLength(0);
  });
});
