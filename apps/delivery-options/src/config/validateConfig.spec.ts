import {describe, expect, it} from 'vitest';
import {get, set} from 'radash';
import {
  AddressField,
  CARRIER_SETTINGS,
  CUTOFF_TIME_SAME_DAY,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  DROP_OFF_POSSIBILITIES,
  FRIDAY_CUTOFF_TIME,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
  SATURDAY_CUTOFF_TIME,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {validateConfig} from './validateConfig';

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

describe('validateConfig', () => {
  it.each([
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 'DE', valid: true},
    {key: `${KEY_ADDRESS}.${AddressField.Country}`, value: 123, valid: false},
    {key: `${KEY_CONFIG}.${CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${DROP_OFF_DELAY}`, value: '-12', valid: true},
    {key: `${KEY_CONFIG}.${CARRIER_SETTINGS}.${CarrierName.PostNl}:1234.${DROP_OFF_DELAY}`, value: 4, valid: true},
    // {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '1,2,3', valid: true, resolvedValue: [1, 2, 3]},
    // {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '1;2;3', valid: true, resolvedValue: [1, 2, 3]},
    // {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: '8', valid: false},
    // {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: [1, 2, 3, 4], valid: true, resolvedValue: [1, 2, 3, 4]},
    // {key: `${KEY_CONFIG}.${DROP_OFF_DAYS}`, value: [8], valid: false},
  ] satisfies TestInput[])('should validate the config and resolve the value', (data) => {
    const config = {...VALID_CONFIG};

    const newConfig = set(config, data.key, data.value);
    const validated = validateConfig(newConfig as unknown as InputDeliveryOptionsConfiguration);

    const resolvedValue = get(validated, data.key, VALUE_MISSING);

    if (data.valid) {
      expect(resolvedValue).toEqual(data.value);
    } else {
      expect(resolvedValue).toBe(VALUE_MISSING);
    }
  });

  it('converts drop off possibilities', () => {
    const config = {
      [DROP_OFF_DAYS]: '1,2,4,5,6',
      [FRIDAY_CUTOFF_TIME]: '12:00',
      [SATURDAY_CUTOFF_TIME]: '13:00',
      [CUTOFF_TIME_SAME_DAY]: '08:00',
    } satisfies InputDeliveryOptionsConfig;

    const validated = validateConfig({config} as unknown as InputDeliveryOptionsConfiguration);

    expect(Object.keys(validated.config)).not.toContain([
      CUTOFF_TIME_SAME_DAY,
      DROP_OFF_DAYS,
      DROP_OFF_POSSIBILITIES,
      FRIDAY_CUTOFF_TIME,
      SATURDAY_CUTOFF_TIME,
    ]);

    expect(validated.config.dropOffPossibilities).toEqual([
      {
        day: '1',
        cutoffTime: '08:00',
        cutoffTimeSameDay: '08:00',
      },
      {
        day: '2',
        cutoffTime: '08:00',
        cutoffTimeSameDay: '08:00',
      },
      {
        day: '4',
        cutoffTime: '12:00',
        cutoffTimeSameDay: '08:00',
      },
      {
        day: '5',
        cutoffTime: '12:00',
        cutoffTimeSameDay: '08:00',
      },
      {
        day: '6',
        cutoffTime: '13:00',
        cutoffTimeSameDay: '08:00',
      },
    ]);
  });

  it('ignores and removes deprecated values if drop off possibilities are passed', () => {
    const config = {
      [DROP_OFF_DAYS]: '1,2,4,5,6',
      [FRIDAY_CUTOFF_TIME]: '12:00',
      [SATURDAY_CUTOFF_TIME]: '13:00',
      [CUTOFF_TIME_SAME_DAY]: '08:00',
      [DROP_OFF_POSSIBILITIES]: [
        {
          day: '2',
          cutoffTime: '08:00',
          cutoffTimeSameDay: '08:00',
        },
      ],
    } satisfies InputDeliveryOptionsConfig;

    const validated = validateConfig({config} as unknown as InputDeliveryOptionsConfiguration);

    expect(Object.keys(validated.config)).not.toContain([
      CUTOFF_TIME_SAME_DAY,
      DROP_OFF_DAYS,
      DROP_OFF_POSSIBILITIES,
      FRIDAY_CUTOFF_TIME,
      SATURDAY_CUTOFF_TIME,
    ]);

    expect(validated.config.dropOffPossibilities).toEqual([
      {
        day: '2',
        cutoffTime: '08:00',
        cutoffTimeSameDay: '08:00',
      },
    ]);
  });
});
