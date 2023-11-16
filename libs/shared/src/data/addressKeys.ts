/* eslint-disable no-magic-numbers */
import {AddressField} from '../types';

export const ADDRESS_CASE_MAP = {
  postal_code: AddressField.PostalCode,
};

export const ADDRESS_FIELD_COMBINATIONS = [
  [AddressField.PostalCode, AddressField.Number],
  [AddressField.PostalCode, AddressField.Street],
  [AddressField.PostalCode, AddressField.City],
  [AddressField.City, AddressField.Street],
];

export const ADDRESS_FIELDS = [
  {
    name: AddressField.Street,
    attributes: {
      autocomplete: 'address-line1',
    },
  },
  {
    name: AddressField.Number,
    attributes: {
      autocomplete: 'off',
      type: 'number',
      min: 1,
      max: 99999,
    },
  },
  {
    name: AddressField.PostalCode,
    attributes: {
      autocomplete: 'postal-code',
    },
  },
  {
    name: AddressField.City,
    attributes: {
      autocomplete: 'address-level2',
    },
  },
];
