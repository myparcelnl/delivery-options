import {
  ADDRESS_NOT_FOUND,
  CC,
  CITY,
  CLOSED,
  COMPACT_BACK_TO_OVERVIEW,
  COMPACT_DELIVERY,
  COMPACT_PICKUP,
  DELIVERY_TITLE,
  DISCOUNT,
  ECO_FRIENDLY,
  ERROR_3212,
  ERROR_3224,
  ERROR_3501,
  ERROR_3505,
  ERROR_3506,
  ERROR_3728,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  NO_DELIVERY_OPTIONS_AVAILABLE,
  NUMBER,
  ONLY_RECIPIENT_TITLE,
  OPENING_HOURS,
  OPTIONS,
  PARCEL_LOCKER,
  PICK_UP,
  PICK_UP_FROM,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  PICKUP_TITLE,
  POSTAL_CODE,
  PRIORITY_DELIVERY_TITLE,
  SHOW_MORE_HOURS,
  SHOW_MORE_LOCATIONS,
  SIGNATURE_TITLE,
  STREET,
  STRINGS_PACKAGE_TYPE_DIGITAL_STAMP,
  STRINGS_PACKAGE_TYPE_MAILBOX,
} from '@myparcel-dev/do-shared';

/**
 * Get the default strings.
 */
export const getDefaultStrings = (): Record<string, string> => ({
  // Address strings
  [CC]: 'Land',
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

  // Compact view
  [COMPACT_DELIVERY]: 'Thuisbezorgen',
  [COMPACT_PICKUP]: 'Afhalen op locatie',
  [COMPACT_BACK_TO_OVERVIEW]: '← Terug naar overzicht',

  // Title of options
  [DELIVERY_TITLE]: 'Thuis of op het werk bezorgen',
  deliveryStandardTitle: 'Standaard bezorging',
  [ECO_FRIENDLY]: 'Meest milieuvriendelijk',
  [NO_DELIVERY_OPTIONS_AVAILABLE]: 'Geen bezorgopties beschikbaar',
  [ONLY_RECIPIENT_TITLE]: 'Alleen ontvanger',
  [PARCEL_LOCKER]: 'Pakketautomaat',
  [PICK_UP]: 'Afhalen',
  [PICK_UP_FROM]: 'Afhalen vanaf',
  [PICKUP_TITLE]: 'Afhalen op locatie',
  [PRIORITY_DELIVERY_TITLE]: 'Prioriteit bezorging',
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
