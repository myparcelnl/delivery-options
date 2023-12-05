import {describe, expect, it} from 'vitest';
import {get, set} from 'radash';
import {AddressField, type InputDeliveryOptionsConfiguration, validateDeliveryOptionsConfig} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {CARRIER_SETTINGS, DROP_OFF_DAYS, DROP_OFF_DELAY, KEY_ADDRESS, KEY_CONFIG, KEY_STRINGS} from '../data';

interface TestInput {
  key: string;
  resolvedValue?: unknown;
  valid: boolean;
  value: unknown;
}

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

describe('validateDeliveryOptionsConfig', () => {
  it.each([
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 'DE', valid: true},
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 123, valid: false},
    {key: `${KEY_CONFIG}.${CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${DROP_OFF_DELAY}`, value: '-12', valid: true},
    {key: `${KEY_CONFIG}.${CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${DROP_OFF_DELAY}`, value: 4, valid: true},
    {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '1,2,3', valid: true, resolvedValue: [1, 2, 3]},
    {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '1;2;3', valid: true, resolvedValue: [1, 2, 3]},
    {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '8', valid: false},
    {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: [1, 2, 3, 4], valid: true, resolvedValue: [1, 2, 3, 4]},
    {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: [8], valid: false},
  ] satisfies TestInput[])('should validate the config and resolve the value', (data) => {
    const config = {...VALID_CONFIG};

    const newConfig = set(config, data.key, data.value);
    const validated = validateDeliveryOptionsConfig(newConfig as unknown as InputDeliveryOptionsConfiguration);

    const resolvedValue = get(validated, data.key, VALUE_MISSING);

    if (data.valid) {
      expect(resolvedValue).toEqual(data.resolvedValue ?? data.value);
    } else {
      expect(resolvedValue).toBe(VALUE_MISSING);
    }
  });
});
