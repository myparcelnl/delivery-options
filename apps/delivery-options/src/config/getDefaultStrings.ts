import {
  ADDRESS_NOT_FOUND,
  CITY,
  CLOSED,
  DELIVERY_TITLE,
  DISCOUNT,
  ERROR_3212,
  ERROR_3224,
  ERROR_3501,
  ERROR_3505,
  ERROR_3506,
  ERROR_3728,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  NUMBER,
  ONLY_RECIPIENT_TITLE,
  OPENING_HOURS,
  OPTIONS,
  PICK_UP,
  PICK_UP_FROM,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  PICKUP_TITLE,
  POSTAL_CODE,
  SHOW_MORE_HOURS,
  SHOW_MORE_LOCATIONS,
  SIGNATURE_TITLE,
  STREET,
  STRINGS_PACKAGE_TYPE_DIGITAL_STAMP,
  STRINGS_PACKAGE_TYPE_MAILBOX,
} from '@myparcel-do/shared';

/**
 * Get the default strings.
 */
export const getDefaultStrings = (): Record<string, string> => ({
  // Address strings
  [CITY]: 'Plaats',
  [POSTAL_CODE]: 'Postcode',
  [NUMBER]: 'Huisnummer',
  [STREET]: 'Straat',
  [ADDRESS_NOT_FOUND]: 'Adresgegevens niet ingevuld',

  // Other strings
  [CLOSED]: 'Gesloten',
  [DISCOUNT]: 'Korting',
  [FROM]: 'Vanaf',

  // [LOAD_MORE]: 'Laad meer',
  [SHOW_MORE_LOCATIONS]: 'Toon meer locaties',
  [SHOW_MORE_HOURS]: 'Toon meer openingstijden',

  // Main header
  [HEADER_DELIVERY_OPTIONS]: '',

  // Title of options
  [DELIVERY_TITLE]: 'Thuis of op het werk bezorgen',
  [ONLY_RECIPIENT_TITLE]: 'Alleen ontvanger',
  [PICK_UP]: 'Afhalen',
  [PICK_UP_FROM]: 'Afhalen vanaf',
  [PICKUP_TITLE]: 'Afhalen op locatie',
  [SIGNATURE_TITLE]: 'Handtekening voor ontvangst',

  // Opening hours
  [OPENING_HOURS]: 'Openingstijden',
  [OPTIONS]: 'Opties',

  [PICKUP_LOCATIONS_LIST_BUTTON]: 'Lijst',
  [PICKUP_LOCATIONS_MAP_BUTTON]: 'Kaart',

  [STRINGS_PACKAGE_TYPE_DIGITAL_STAMP]: 'Digitale postzegel',
  [STRINGS_PACKAGE_TYPE_MAILBOX]: 'Brievenbuspakje',

  [ERROR_3212]: '{} is verplicht.',
  [ERROR_3224]: '',
  [ERROR_3501]: 'Dit adres is niet gevonden.',
  [ERROR_3505]: 'Postcode is niet geldig voor het gekozen land.',
  [ERROR_3506]: '',
  [ERROR_3728]: '',
});
