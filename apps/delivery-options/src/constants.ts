import {ShipmentOptionName} from '@myparcel/constants';

export const FIELD_DELIVERY_MOMENT = 'deliveryMoment';

export const FIELD_DELIVERY_DATE = 'deliveryDate';

export const FIELD_SHIPMENT_OPTIONS = 'shipmentOptions';

export const SHOWN_SHIPMENT_OPTIONS = [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient] as const;

export const DAY_MONDAY = '1' as const;

export const DAY_TUESDAY = '2' as const;

export const DAY_WEDNESDAY = '3' as const;

export const DAY_THURSDAY = '4' as const;

export const DAY_FRIDAY = '5' as const;

export const DAY_SATURDAY = '6' as const;

export const DAY_SUNDAY = '0' as const;
