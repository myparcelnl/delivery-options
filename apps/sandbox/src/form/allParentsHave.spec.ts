import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CarrierSetting} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {allParentsHave} from './allParentsHave';

interface TestInput {
  configuration: Record<string, unknown>;
  it: string;
  parents: string[];
  prefix: string;
  result: boolean;
}

/**
 * Sets up the sandbox store with the given configuration values.
 */
const setupSandboxStore = (configuration: Record<string, unknown>) => {
  const store = useSandboxStore();
  // Mock the store state
  vi.spyOn(store, 'config', 'get').mockReturnValue({
    ...configuration,
  });
};

describe('allParentsHave', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it.each([
    {
      it: 'returns true if there are no parents',
      parents: [],
      configuration: {},
      prefix: '',
      result: true,
    },
    {
      it: 'returns true if all parents are enabled',
      parents: [CarrierSetting.AllowDeliveryOptions],
      configuration: {[CarrierSetting.AllowDeliveryOptions]: true},
      prefix: 'config',
      result: true,
    },
    {
      it: 'returns false if one of the parents is disabled',
      parents: [CarrierSetting.AllowDeliveryOptions, CarrierSetting.AllowPickupLocations],
      configuration: {
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowPickupLocations]: false,
      },
      prefix: 'config',
      result: false,
    },
    {
      it: 'works with prefixes',
      parents: [CarrierSetting.AllowDeliveryOptions],
      configuration: {
        some_long_prefix: {[CarrierSetting.AllowDeliveryOptions]: true},
      },
      prefix: 'config.some_long_prefix',
      result: true,
    },
  ] satisfies TestInput[])('$it', ({parents, configuration, prefix, result}) => {
    setupSandboxStore(configuration);

    expect(allParentsHave(parents, prefix)).toBe(result);
  });
});
