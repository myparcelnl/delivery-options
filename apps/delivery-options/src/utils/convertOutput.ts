import {FEATURE_SHOW_DELIVERY_DATE} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {type DeliveryOptionsOutput, type InternalOutput, type SelectedDeliveryMoment} from '../types';
import {getResolvedValue} from './getResolvedValue';

export const convertOutput = (output: InternalOutput): DeliveryOptionsOutput => {
  const deliveryMoment = JSON.parse(output.deliveryMoment || '{}') as SelectedDeliveryMoment;
  const showDeliveryDate = getResolvedValue(FEATURE_SHOW_DELIVERY_DATE);

  return {
    deliveryType: deliveryMoment.deliveryType,
    packageType: deliveryMoment.packageType,
    date: showDeliveryDate ? output.deliveryDate : undefined,
    carrier: deliveryMoment.carrier,
    isPickup: false,
    shipmentOptions: {
      signature: output.shipmentOptions?.includes(ShipmentOptionName.Signature) ?? false,
      onlyRecipient: output.shipmentOptions?.includes(ShipmentOptionName.OnlyRecipient) ?? false,
    },
  } as DeliveryOptionsOutput;
};
