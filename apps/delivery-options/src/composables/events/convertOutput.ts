import {
  ConfigSetting,
  type DeliveryOutput,
  type InternalOutput,
  type InternalOutputWithPickupLocation,
  type PickupOutput,
} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {usePickupLocation} from '../usePickupLocation';
import {getResolvedValue} from '../../utils';
import {type SelectedDeliveryMoment} from '../../types';
import {HOME_OR_PICKUP_PICKUP} from '../../data';

const createDeliveryOutput = (output: InternalOutput): DeliveryOutput => {
  const deliveryMoment = JSON.parse(output.deliveryMoment || '{}') as SelectedDeliveryMoment;
  const showDeliveryDate = getResolvedValue(ConfigSetting.ShowDeliveryDate);

  return {
    carrier: deliveryMoment.carrier,
    date: showDeliveryDate ? output.deliveryDate : undefined,
    deliveryType: deliveryMoment.deliveryType,
    isPickup: false,
    packageType: deliveryMoment.packageType,
    shipmentOptions: {
      signature: output.shipmentOptions?.includes(ShipmentOptionName.Signature) ?? false,
      onlyRecipient: output.shipmentOptions?.includes(ShipmentOptionName.OnlyRecipient) ?? false,
    },
  };
};

const createPickupOutput = (output: InternalOutputWithPickupLocation): PickupOutput => {
  const result = usePickupLocation(output.pickupLocation);

  const {carrier, location} = result.value ?? {};

  return {
    carrier: carrier?.identifier ?? CarrierName.PostNl,
    date: undefined,
    deliveryType: DeliveryTypeName.Pickup,
    isPickup: true,
    packageType: PackageTypeName.Package,
    pickupLocation: location,
    shipmentOptions: {},
  };
};

export const convertOutput = (internalOutput: InternalOutput): PickupOutput | DeliveryOutput => {
  return internalOutput.homeOrPickup === HOME_OR_PICKUP_PICKUP && Boolean(internalOutput.pickupLocation)
    ? createPickupOutput(internalOutput as InternalOutputWithPickupLocation)
    : createDeliveryOutput(internalOutput);
};
