import {
  ConfigSetting,
  type DeliveryOptionsOutput,
  type DeliveryOutput,
  type InternalOutput,
  type MakeRequired,
  type OutputPickupLocation,
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
  const {carrier, location} = usePickupLocation(output.pickupLocation);

  const carrierIdentifier = carrier?.value?.identifier ?? CarrierName.PostNl;

  return {
    date: undefined,
    isPickup: true,
    deliveryType: DeliveryTypeName.Pickup,
    packageType: PackageTypeName.Package,
    shipmentOptions: {},
    carrier: carrierIdentifier,
    pickupLocation: location.value ?? ({} as OutputPickupLocation),
  };
};

export const convertOutput = (output: InternalOutput): DeliveryOptionsOutput => {
  if (output.homeOrPickup === HOME_OR_PICKUP_PICKUP && output.pickupLocation) {
    return createPickupOutput(output as InternalOutputWithPickupLocation);
  }

  return createDeliveryOutput(output);
};
