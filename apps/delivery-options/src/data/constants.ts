import {ShipmentOptionName} from '@myparcel/constants';

/**
 * Stores whether home delivery or pickup is selected.
 */
export const FIELD_HOME_OR_PICKUP = 'homeOrPickup';

export const HOME_OR_PICKUP_HOME = 'home';

export const HOME_OR_PICKUP_PICKUP = 'pickup';

/**
 * Stores the selected delivery date for home delivery.
 */
export const FIELD_DELIVERY_DATE = 'deliveryDate';

/**
 * Stores the selected delivery moment for home delivery.
 */
export const FIELD_DELIVERY_MOMENT = 'deliveryMoment';

/**
 * Stores the selected shipment options for home delivery.
 */
export const FIELD_SHIPMENT_OPTIONS = 'shipmentOptions';

/**
 * Stores the selected pickup location if pickup is selected.
 */
export const FIELD_PICKUP_LOCATION = 'pickupLocation';

export const SHOWN_SHIPMENT_OPTIONS = [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient] as const;

export const MAP_MARKER_CLASS_ACTIVE = 'active';

export const MAP_MARKER_CLASS_PREFIX = 'mp__carrier-marker';

export const SHOWN_OPENING_HOURS = 3;

export const OUTPUT_EVENT_DEBOUNCE_DELAY = 10;

export const DATES_SHOWN_SM = 2;

export const DATES_SHOWN_MD = 4;
