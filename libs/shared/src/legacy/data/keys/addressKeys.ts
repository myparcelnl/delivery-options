/* eslint-disable no-magic-numbers */
import {AddressField} from '../../../types/address.types';

export const KEY_ADDRESS = 'address';

// Properties

export const ADDRESS_CC = AddressField.Cc;

export const ADDRESS_CITY = AddressField.City;

export const ADDRESS_NUMBER = AddressField.Number;

export const ADDRESS_POSTAL_CODE = AddressField.PostalCode;

export const ADDRESS_STREET = AddressField.Street;

export const ADDRESS_CASE_MAP = {
  postal_code: ADDRESS_POSTAL_CODE,
};

export const ADDRESS_FIELD_COMBINATIONS = [
  [ADDRESS_POSTAL_CODE, ADDRESS_NUMBER],
  [ADDRESS_POSTAL_CODE, ADDRESS_STREET],
  [ADDRESS_POSTAL_CODE, ADDRESS_CITY],
  [ADDRESS_CITY, ADDRESS_STREET],
];

export const ADDRESS_FIELDS = [
  {
    name: ADDRESS_STREET,
    attributes: {
      autocomplete: 'address-line1',
    },
  },
  {
    name: ADDRESS_NUMBER,
    attributes: {
      autocomplete: 'off',
      type: 'number',
      min: 1,
      max: 99999,
    },
  },
  {
    name: ADDRESS_POSTAL_CODE,
    attributes: {
      autocomplete: 'postal-code',
    },
  },
  {
    name: ADDRESS_CITY,
    attributes: {
      autocomplete: 'address-level2',
    },
  },
];
