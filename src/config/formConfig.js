import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';

export const DELIVERY = 'delivery';

// Delivery > Deliver
export const DELIVER = 'deliver';

// Delivery > Deliver > Carrier
// (Also used for pickup carrier)
export const CARRIER = 'carrier';

export const PACKAGE_TYPE = 'packageType';

// Delivery > Deliver (> Carrier) > Delivery date
export const DELIVERY_DATE = 'deliveryDate';

// Delivery > Deliver (> Carrier) > Delivery moment
export const DELIVERY_MOMENT = 'deliveryMoment';

// Delivery > Deliver (> Carrier) > Delivery moment = morning | standard | evening
/** @type {MyParcelDeliveryOptions.DeliveryType} */
export const DELIVERY_MORNING = 'morning';
/** @type {MyParcelDeliveryOptions.DeliveryType} */
export const DELIVERY_STANDARD = 'standard';
/** @type {MyParcelDeliveryOptions.DeliveryType} */
export const DELIVERY_EVENING = 'evening';

/*
 Not a real delivery type. Only used internally to avoid having to write a lot of custom logic. It's transformed back
 into "standard" when exporting.
*/
/** @type {MyParcelDeliveryOptions.DeliveryType} */
export const DELIVERY_SAME_DAY = 'sameDay';

// Delivery > Deliver (> Carrier) > Delivery moment > Shipment options
export const SHIPMENT_OPTIONS = 'shipmentOptions';

// Delivery > Deliver (> Carrier) > Delivery moment > Shipment options = [signature?, only_recipient?]
export const SIGNATURE = 'signature';
export const ONLY_RECIPIENT = 'only_recipient';
export const SAME_DAY_DELIVERY = 'same_day_delivery';

// Delivery > Pickup
export const PICKUP = 'pickup';

// Delivery > Pickup (> Pickup location)
export const PICKUP_LOCATION = 'pickupLocation';

// Delivery > Pickup (> Pickup location) > Pickup moment
export const PICKUP_MOMENT = 'pickupMoment';

// Delivery > Pickup (> Pickup location) > Pickup moment = standard
export const PICKUP_STANDARD = 'pickup';

export const MONDAY_DELIVERY = 'monday';
export const SATURDAY_DELIVERY = 'saturday';

/**
 * Delivery options.
 *
 * @type {MyParcelDeliveryOptions.FormConfig}
 * @see https://myparcelnl.github.io/api/#8
 */
export const formConfigDelivery = {
  name: DELIVERY,
  enabled: CONFIG.ALLOW_DELIVERY_OPTIONS,
  options: [
    {
      name: DELIVERY_SAME_DAY,
      enabled: CONFIG.ALLOW_SAME_DAY_DELIVERY,
      label: STRINGS.DELIVERY_SAME_DAY_DELIVERY_TITLE,
      price: CONFIG.PRICE_SAME_DAY_DELIVERY,
    },
    {
      name: DELIVERY_MORNING,
      enabled: CONFIG.ALLOW_MORNING_DELIVERY,
      label: STRINGS.DELIVERY_MORNING_TITLE,
      price: CONFIG.PRICE_MORNING_DELIVERY,
    },
    {
      name: DELIVERY_STANDARD,
      label: STRINGS.DELIVERY_STANDARD_TITLE,
      price: CONFIG.PRICE_STANDARD_DELIVERY,
      selected: true,
    },
    {
      name: DELIVERY_EVENING,
      enabled: CONFIG.ALLOW_EVENING_DELIVERY,
      label: STRINGS.DELIVERY_EVENING_TITLE,
      price: CONFIG.PRICE_EVENING_DELIVERY,
    },
  ],
};

/**
 * Shipment options for delivery.
 *
 * @type {MyParcelDeliveryOptions.FormConfig}
 * @see https://myparcelnl.github.io/api/#7_C
 */
export const formConfigShipmentOptions = {
  name: SHIPMENT_OPTIONS,
  options: [
    {
      name: SIGNATURE,
      enabled: CONFIG.ALLOW_SIGNATURE,
      label: STRINGS.SIGNATURE_TITLE,
      price: CONFIG.PRICE_SIGNATURE,
    },
    {
      name: ONLY_RECIPIENT,
      enabled: CONFIG.ALLOW_ONLY_RECIPIENT,
      label: STRINGS.ONLY_RECIPIENT_TITLE,
      price: CONFIG.PRICE_ONLY_RECIPIENT,
    },
  ],
};

/**
 * Pickup locations.
 *
 * @type {MyParcelDeliveryOptions.FormConfig}
 * @see https://myparcelnl.github.io/api/#7_O
 */
export const formConfigPickup = {
  name: PICKUP,
  enabled: CONFIG.ALLOW_PICKUP_LOCATIONS,
  options: [
    {
      name: PICKUP_STANDARD,
      price: CONFIG.PRICE_PICKUP,
      selected: true,
    },
  ],
};

/**
 * Base form config.
 *
 * @type {MyParcelDeliveryOptions.FormConfig[]}
 */
export const formConfig = [
  formConfigDelivery,
  formConfigShipmentOptions,
  formConfigPickup,
];


/**
 * Defines the order the delivery moments should be displayed.
 *
 * @type {string[]}
 */
export const deliveryMoments = [
  DELIVERY_MORNING,
  DELIVERY_STANDARD,
  DELIVERY_SAME_DAY,
  DELIVERY_EVENING
];
