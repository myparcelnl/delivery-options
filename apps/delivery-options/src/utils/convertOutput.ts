import {
  ConfigSetting,
  type DeliveryOptionsOutput,
  type DeliveryOutput,
  type InternalOutput,
  type MakeRequired,
  type PickupOutput,
} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../types';
import {HOME_OR_PICKUP_PICKUP} from '../data';
import {usePickupLocation} from '../composables/usePickupLocation';
import {getResolvedValue} from './getResolvedValue';

type InternalOutputWithPickupLocation = MakeRequired<InternalOutput, 'pickupLocation'>;

const createDeliveryOutput = (output: InternalOutput): DeliveryOutput => {
  const deliveryMoment = JSON.parse(output.deliveryMoment || '{}') as SelectedDeliveryMoment;
  const showDeliveryDate = getResolvedValue(ConfigSetting.ShowDeliveryDate);

  return {
    isPickup: false,
    deliveryType: deliveryMoment.deliveryType,
    packageType: deliveryMoment.packageType,
    date: showDeliveryDate ? output.deliveryDate : undefined,
    carrier: deliveryMoment.carrier,
    shipmentOptions: {
      signature: output.shipmentOptions?.includes(ShipmentOptionName.Signature) ?? false,
      onlyRecipient: output.shipmentOptions?.includes(ShipmentOptionName.OnlyRecipient) ?? false,
    },
  };
};

const createPickupOutput = (output: InternalOutputWithPickupLocation): PickupOutput => {
  const result = usePickupLocation(output.pickupLocation);

  const {carrier, location} = result;

  return {
    date: undefined,
    isPickup: true,
    carrier: carrier.value?.identifier ?? CarrierName.PostNl,
    deliveryType: DeliveryTypeName.Pickup,
    packageType: PackageTypeName.Package,
    shipmentOptions: {},
    pickupLocation: location.value,
  };
};

export const convertOutput = (output: InternalOutput): DeliveryOptionsOutput => {
  if (output.homeOrPickup === HOME_OR_PICKUP_PICKUP && output.pickupLocation) {
    return createPickupOutput(output as InternalOutputWithPickupLocation);
  }

  return createDeliveryOutput(output);
};
