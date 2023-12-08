import {type DeliveryOptionsOutput, type InternalOutput} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../types';

export const convertOutput = (output: InternalOutput): DeliveryOptionsOutput => {
  const deliveryMoment = JSON.parse(output.deliveryMoment || '{}') as SelectedDeliveryMoment;

  return {
    deliveryType: deliveryMoment.deliveryType,
    packageType: deliveryMoment.packageType,
    date: output.deliveryDate,
    carrier: deliveryMoment.carrier,
    isPickup: false,
    shipmentOptions: {
      signature: output.shipmentOptions?.includes(ShipmentOptionName.Signature) ?? false,
      onlyRecipient: output.shipmentOptions?.includes(ShipmentOptionName.OnlyRecipient) ?? false,
    },
  } as DeliveryOptionsOutput;
};
