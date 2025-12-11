import {ref} from 'vue';
import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CarrierSetting} from '@myparcel-dev/shared';
import {defineField, defineForm} from '@myparcel-dev/vue-form-builder';
import {allParentsHave} from './allParentsHave';

const createRandomString = (): string => Math.random().toString(36).substring(7);

interface TestInput {
  fields: {name: string; value: unknown}[];
  it: string;
  parents: string[];
  prefix: string;
  result: boolean;
}

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
      it: 'returns false if one of the parents is disabled',
      parents: [CarrierSetting.AllowDeliveryOptions, CarrierSetting.AllowPickupLocations],
      fields: [
        {name: CarrierSetting.AllowDeliveryOptions, value: true},
        {name: CarrierSetting.AllowPickupLocations, value: false},
      ],
      prefix: '',
      result: false,
    },
  ] satisfies TestInput[])('$it', ({parents, fields, prefix, result}) => {
    const form = defineForm(createRandomString(), {
      fields: fields.map(({name, value}) => defineField({component: 'input', name, ref: ref(value)})),
    });

    expect(allParentsHave(parents, form, prefix)).toBe(result);
  });

  it.skip.each([
    {
      it: 'returns true if all parents are enabled',
      parents: [CarrierSetting.AllowDeliveryOptions],
      fields: [{name: CarrierSetting.AllowDeliveryOptions, value: true}],
      prefix: '',
      result: true,
    },
    {
      it: 'works with prefixes',
      parents: [CarrierSetting.AllowDeliveryOptions],
      fields: [{name: `some.long.prefix.${CarrierSetting.AllowDeliveryOptions}`, value: true}],
      prefix: 'some.long.prefix',
      result: true,
    },
  ] satisfies TestInput[])('$it', ({parents, fields, prefix, result}) => {
    const form = defineForm(createRandomString(), {
      fields: fields.map(({name, value}) => defineField({component: 'input', name, ref: ref(value)})),
    });

    expect(allParentsHave(parents, form, prefix)).toBe(result);
  });
});
