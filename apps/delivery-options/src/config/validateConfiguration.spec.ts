import {afterEach, beforeEach, describe, expect, it, type MockInstance, vi} from 'vitest';
import {get, set} from 'radash';
import {
  AddressField,
  CarrierSetting,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/shared';
import {CarrierName} from '@myparcel-dev/constants';
import {validateConfiguration} from './validateConfiguration';

interface TestInput {
  key: string;
  resolvedValue?: unknown;
  valid: boolean;
  value: unknown;
}

describe('validateConfiguration', () => {
  let errorSpy: MockInstance;

  const VALUE_MISSING = 'MISSING';

  const VALID_CONFIG = Object.freeze({
    [KEY_ADDRESS]: {
      [AddressField.Country]: 'NL',
      [AddressField.City]: 'Amsterdam',
      [AddressField.PostalCode]: '1234AB',
      [AddressField.Street]: 'foo',
      [AddressField.Number]: '12',
    },
    [KEY_STRINGS]: {},
    [KEY_CONFIG]: {},
  }) satisfies Omit<InputDeliveryOptionsConfiguration, 'components'>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it.each([
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 'DE', valid: true},
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 123, valid: false},
    {
      key: `${KEY_CONFIG}.${KEY_CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${CarrierSetting.DropOffDelay}`,
      value: '-12',
      valid: false,
    },
    {
      key: `${KEY_CONFIG}.${KEY_CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${CarrierSetting.DropOffDelay}`,
      value: 4,
      valid: true,
    },
    {key: `${KEY_CONFIG}.${CarrierSetting.CutoffTime}`, value: '15:00', valid: true},
    {key: `${KEY_CONFIG}.${CarrierSetting.DropOffDays}`, value: [1, 2, 3], valid: true},
    {key: `${KEY_CONFIG}.${CarrierSetting.DropOffDays}`, value: [8], valid: false},
  ] satisfies TestInput[])('validates $key with value $value to $valid', (data) => {
    const newConfig = set({...VALID_CONFIG}, data.key, data.value);

    const validated = validateConfiguration(newConfig as unknown as InputDeliveryOptionsConfiguration);

    const resolvedValue = get(validated, data.key, VALUE_MISSING);

    if (data.valid) {
      expect(resolvedValue).toEqual(data.value);
    } else {
      expect(resolvedValue).toBe(VALUE_MISSING);
    }
  });
});
