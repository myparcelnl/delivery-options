import {type DeliveryOptionsOutput, type InternalOutput} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';

export const convertOutput = (output: InternalOutput): DeliveryOptionsOutput => {
  return {
    deliveryType: output.deliveryMoment?.deliveryType,
    packageType: output.deliveryMoment?.packageType,
    date: output.deliveryDate,
    carrier: output.deliveryMoment?.carrier,
    isPickup: false,
    shipmentOptions: {
      signature: output.shipmentOptions?.includes(ShipmentOptionName.Signature) ?? false,
      onlyRecipient: output.shipmentOptions?.includes(ShipmentOptionName.OnlyRecipient) ?? false,
    },
  } as DeliveryOptionsOutput;
};
