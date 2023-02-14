/* eslint-disable no-magic-numbers */
export const KEY = 'address';

// Properties
export const CC = 'cc';
export const CITY = 'city';
export const NUMBER = 'number';
export const POSTAL_CODE = 'postalCode';
export const STREET = 'street';

export const ADDRESS_CASE_MAP = {
  postal_code: POSTAL_CODE,
};

export const ADDRESS_FIELD_COMBINATIONS = [
  [POSTAL_CODE, NUMBER],
  [POSTAL_CODE, STREET],
  [POSTAL_CODE, CITY],
  [CITY, STREET],
];

export const ADDRESS_FIELDS = [
  {
    name: STREET,
    attributes: {
      autocomplete: 'address-line1',
    },
  },
  {
    name: NUMBER,
    attributes: {
      autocomplete: 'off',
      type: 'number',
      min: 1,
      max: 99999,
    },
  },
  {
    name: POSTAL_CODE,
    attributes: {
      autocomplete: 'postal-code',
    },
  },
  {
    name: CITY,
    attributes: {
      autocomplete: 'address-level2',
    },
  },
];
