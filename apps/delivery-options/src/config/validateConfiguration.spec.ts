import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {get, set} from 'radash';
import {
  AddressField,
  CarrierSetting,
  ConfigSetting,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {validateConfiguration} from './validateConfiguration';

interface TestInput {
  key: string;
  resolvedValue?: unknown;
  valid: boolean;
  value: unknown;
}

describe('validateConfiguration', () => {
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
    vi.spyOn(console, 'error');
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
    {key: `${KEY_CONFIG}.${ConfigSetting.Platform}`, value: 'myparcel', valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.Platform}`, value: 'belgie', valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.Platform}`, value: 123, valid: false},
    {key: `${KEY_CONFIG}.${ConfigSetting.CompactView}`, value: true, valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.CompactView}`, value: false, valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.CompactView}`, value: 'invalid', valid: false},
    {key: `${KEY_CONFIG}.${ConfigSetting.PopUpMap}`, value: true, valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.PopUpMap}`, value: false, valid: true},
    {key: `${KEY_CONFIG}.${ConfigSetting.PopUpMap}`, value: 'invalid', valid: false},
    ...[1, 20000, 30000].map((weight) => ({
      key: `${KEY_CONFIG}.${ConfigSetting.PhysicalProperties}`,
      value: {weight},
      valid: true,
    })),
    ...[0, -1, 1.5, '30000', Infinity, NaN, Number.MAX_SAFE_INTEGER + 1].map((weight) => ({
      key: `${KEY_CONFIG}.${ConfigSetting.PhysicalProperties}`,
      value: {weight},
      valid: false,
    })),
    ...[{}, [], '30000', {weight: null}, {weight: {value: 30000, unit: 'g'}}].map((value) => ({
      key: `${KEY_CONFIG}.${ConfigSetting.PhysicalProperties}`,
      value,
      valid: false,
    })),
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

  it('preserves an explicit null and logs invalid weight input', () => {
    expect(
      validateConfiguration({...VALID_CONFIG, config: {physicalProperties: null}}).config.physicalProperties,
    ).toBeNull();
    const input = {...VALID_CONFIG, config: {physicalProperties: {weight: 0}}};
    expect(validateConfiguration(input as InputDeliveryOptionsConfiguration).config).not.toHaveProperty(
      'physicalProperties',
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('forwards only supported weight properties', () => {
    const input = {
      ...VALID_CONFIG,
      config: {physicalProperties: {weight: 30000, height: 10}},
    };
    expect(validateConfiguration(input as InputDeliveryOptionsConfiguration).config.physicalProperties).toEqual({
      weight: 30000,
    });
  });
});
