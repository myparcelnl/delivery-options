import {ALLOW_ONLY_RECIPIENT, ALLOW_SIGNATURE} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';

export const FIELD_DELIVERY_MOMENT = 'deliveryMoment';

export const FIELD_DELIVERY_DATE = 'deliveryDate';

export const FIELD_SHIPMENT_OPTIONS = 'shipmentOptions';

export const SHOWN_SHIPMENT_OPTIONS = [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient] as const;

export const SHIPMENT_OPTION_CONFIG_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: ALLOW_SIGNATURE,
  [ShipmentOptionName.OnlyRecipient]: ALLOW_ONLY_RECIPIENT,
});
