const SHOW_MORE = 'showMore';

// Properties
export const CC = 'cc';

export const CITY = 'city';

export const POSTAL_CODE = 'postalCode';

export const NUMBER = 'number';

export const STREET = 'street';

export const ADDRESS_NOT_FOUND = 'addressNotFound';

export const CLOSED = 'closed';

export const DISCOUNT = 'discount';

export const FROM = 'from';

export const SHOW_MORE_LOCATIONS = `${SHOW_MORE}Locations`;

export const SHOW_MORE_HOURS = `${SHOW_MORE}Hours`;

export const PICK_UP = 'pickUp';

export const PICK_UP_FROM = 'pickUpFrom';

export const PARCEL_LOCKER = 'parcelLocker';

export const OPENING_HOURS = 'openingHours';

export const OPTIONS = 'options';

export const HEADER_DELIVERY_OPTIONS = 'headerDeliveryOptions';

export const DELIVERY_TITLE = 'deliveryTitle';

export const ONLY_RECIPIENT_TITLE = 'onlyRecipientTitle';

export const PICKUP_TITLE = 'pickupTitle';

export const SIGNATURE_TITLE = 'signatureTitle';

export const CHOOSE_DATE = 'chooseDate';

export const WRONG_NUMBER_POSTAL_CODE = 'wrongNumberPostalCode';

export const WRONG_POSTAL_CODE_CITY = 'wrongPostalCodeCity';

export const MONDAY_DELIVERY_TITLE = 'mondayDeliveryTitle';

export const SATURDAY_DELIVERY_TITLE = 'saturdayDeliveryTitle';

export const PICKUP_LOCATIONS_LIST_BUTTON = 'pickupLocationsListButton';

export const PICKUP_LOCATIONS_MAP_BUTTON = 'pickupLocationsMapButton';

export const STRINGS_PACKAGE_TYPE_DIGITAL_STAMP = 'packageTypeDigitalStamp';

export const STRINGS_PACKAGE_TYPE_MAILBOX = 'packageTypeMailbox';

export const ECO_FRIENDLY = 'ecoFriendly';

export const ERROR_3212 = 'error3212';

export const ERROR_3224 = 'error3224';

export const ERROR_3501 = 'error3501';

export const ERROR_3505 = 'error3505';

export const ERROR_3506 = 'error3506';

export const ERROR_3728 = 'error3728';

export const ALL_STRINGS = [
  ADDRESS_NOT_FOUND,
  CC,
  CITY,
  CLOSED,
  DELIVERY_TITLE,
  DISCOUNT,
  ECO_FRIENDLY,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  MONDAY_DELIVERY_TITLE,
  NUMBER,
  ONLY_RECIPIENT_TITLE,
  OPENING_HOURS,
  OPTIONS,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  PICKUP_TITLE,
  PICK_UP,
  PICK_UP_FROM,
  POSTAL_CODE,
  SATURDAY_DELIVERY_TITLE,
  SHOW_MORE_HOURS,
  SHOW_MORE_LOCATIONS,
  SIGNATURE_TITLE,
  STREET,
  STRINGS_PACKAGE_TYPE_DIGITAL_STAMP,
  STRINGS_PACKAGE_TYPE_MAILBOX,
  WRONG_NUMBER_POSTAL_CODE,
  WRONG_POSTAL_CODE_CITY,
  ERROR_3212,
  ERROR_3224,
  ERROR_3501,
  ERROR_3505,
  ERROR_3506,
  ERROR_3728,
] as const;
