import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SIGNATURE,
  DELIVERY_EVENING_TITLE,
  DELIVERY_MORNING_TITLE,
  DELIVERY_SAME_DAY_DELIVERY_TITLE,
  DELIVERY_STANDARD_TITLE,
  ONLY_RECIPIENT_TITLE,
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PICKUP,
  PRICE_SAME_DAY_DELIVERY,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
  SIGNATURE_TITLE,
} from '../data';

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
export const DELIVERY_MORNING = 'morning';

export const DELIVERY_STANDARD = 'standard';

export const DELIVERY_EVENING = 'evening';

/*
 Not a real delivery type. Only used internally to avoid having to write a lot of custom logic. It's transformed back
 into "standard" when exporting.
*/
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
 * @see https://myparcelnl.github.io/api/#8
 */
export const formConfigDelivery = {
  name: DELIVERY,
  enabled: ALLOW_DELIVERY_OPTIONS,
  options: [
    {
      name: DELIVERY_SAME_DAY,
      enabled: ALLOW_SAME_DAY_DELIVERY,
      label: DELIVERY_SAME_DAY_DELIVERY_TITLE,
      price: PRICE_SAME_DAY_DELIVERY,
    },
    {
      name: DELIVERY_MORNING,
      enabled: ALLOW_MORNING_DELIVERY,
      label: DELIVERY_MORNING_TITLE,
      price: PRICE_MORNING_DELIVERY,
    },
    {
      name: DELIVERY_STANDARD,
      label: DELIVERY_STANDARD_TITLE,
      price: PRICE_STANDARD_DELIVERY,
      selected: true,
    },
    {
      name: DELIVERY_EVENING,
      enabled: ALLOW_EVENING_DELIVERY,
      label: DELIVERY_EVENING_TITLE,
      price: PRICE_EVENING_DELIVERY,
    },
  ],
};

/**
 * Shipment options for delivery.
 *
 * @see https://myparcelnl.github.io/api/#7_C
 */
export const formConfigShipmentOptions = {
  name: SHIPMENT_OPTIONS,
  options: [
    {
      name: SIGNATURE,
      enabled: ALLOW_SIGNATURE,
      label: SIGNATURE_TITLE,
      price: PRICE_SIGNATURE,
    },
    {
      name: ONLY_RECIPIENT,
      enabled: ALLOW_ONLY_RECIPIENT,
      label: ONLY_RECIPIENT_TITLE,
      price: PRICE_ONLY_RECIPIENT,
    },
  ],
} as const;

/**
 * Pickup locations.
 *
 * @see https://myparcelnl.github.io/api/#7_O
 */
export const formConfigPickup = {
  name: PICKUP,
  enabled: ALLOW_PICKUP_LOCATIONS,
  options: [
    {
      name: PICKUP_STANDARD,
      price: PRICE_PICKUP,
      selected: true,
    },
  ],
} as const;

/**
 * Base form config.
 *
 */
export const formConfig = [formConfigDelivery, formConfigShipmentOptions, formConfigPickup] as const;

/**
 * Defines the order the delivery moments should be displayed.
 *
 */
export const deliveryMoments = [DELIVERY_MORNING, DELIVERY_STANDARD, DELIVERY_SAME_DAY, DELIVERY_EVENING] as const;
