import {type DeliveryPossibility} from '@myparcel/sdk';
import {ShipmentOptionName} from '@myparcel/constants';

export const getShipmentOptions = (required: ShipmentOptionName[] = []): DeliveryPossibility['shipment_options'] => {
  const option = (name: ShipmentOptionName): DeliveryPossibility['shipment_options'][number] => ({
    name,
    schema: {
      type: 'boolean',
      enum: required.includes(name) ? [true] : [true, false],
    },
  });

  return [
    option(ShipmentOptionName.AgeCheck),
    option(ShipmentOptionName.LargeFormat),
    option(ShipmentOptionName.OnlyRecipient),
    option(ShipmentOptionName.Return),
    option(ShipmentOptionName.SameDayDelivery),
    option(ShipmentOptionName.Signature),
  ];
};
