import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CarrierSetting} from '@myparcel-dev/shared';
import {type FormInstance} from '@myparcel-dev/vue-form-builder';
import {allParentsHave} from './allParentsHave';

interface TestInput {
  fields: {name: string; value: unknown}[];
  it: string;
  parents: string[];
  prefix: string;
  result: boolean;
}

/**
 * Creates a mock form with the given field values.
 * This avoids the vue-form-builder API where fields are only registered after mount.
 */
const createMockForm = (fields: {name: string; value: unknown}[]): FormInstance => {
  const values: Record<string, unknown> = {};
  fields.forEach(({name, value}) => {
    values[name] = value;
  });

  return {values} as unknown as FormInstance;
};

describe('allParentsHave', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    {
      it: 'returns true if there are no parents',
      parents: [],
      fields: [],
      prefix: '',
      result: true,
    },
    {
      it: 'returns true if all parents are enabled',
      parents: [CarrierSetting.AllowDeliveryOptions],
      fields: [{name: CarrierSetting.AllowDeliveryOptions, value: true}],
      prefix: '',
      result: true,
    },
    {
      it: 'returns false if one of the parents is disabled',
      parents: [CarrierSetting.AllowDeliveryOptions, CarrierSetting.AllowPickupLocations],
      fields: [
        {name: CarrierSetting.AllowDeliveryOptions, value: true},
        {name: CarrierSetting.AllowPickupLocations, value: false},
      ],
      prefix: '',
      result: false,
    },
    {
      it: 'works with prefixes',
      parents: [CarrierSetting.AllowDeliveryOptions],
      fields: [{name: `some.long.prefix.${CarrierSetting.AllowDeliveryOptions}`, value: true}],
      prefix: 'some.long.prefix',
      result: true,
    },
  ] satisfies TestInput[])('$it', ({parents, fields, prefix, result}) => {
    const form = createMockForm(fields);

    expect(allParentsHave(parents, form, prefix)).toBe(result);
  });
});
