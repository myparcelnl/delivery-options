import {computed, type ComputedRef} from 'vue';
import {isDef} from '@vueuse/core';
import {
  ConfigSetting,
  type DeliveryOutput,
  type PickupOutput,
  type SupportedDeliveryTypeName,
  type DeliveryDeliveryType,
} from '@myparcel-do/shared';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {useSelectedPickupLocation} from '../useSelectedPickupLocation';
import {useSelectedDeliveryMoment} from '../useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from '../useResolvedDeliveryOptions';
import {getResolvedValue, parseJson} from '../../utils';
import {type SelectedDeliveryMoment} from '../../types';
import {useDeliveryOptionsForm} from '../../form';
import {FIELD_DELIVERY_MOMENT, FIELD_SHIPMENT_OPTIONS} from '../../data';

const DELIVERY_DELIVERY_TYPES: readonly SupportedDeliveryTypeName[] = Object.freeze([
  DeliveryTypeName.Morning,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Standard,
]);

export const useResolvedValues = (): ComputedRef<PickupOutput | DeliveryOutput | undefined> => {
  const {instance: form} = useDeliveryOptionsForm();

  const deliveryOptions = useResolvedDeliveryOptions();
  const pickupLocation = useSelectedPickupLocation();
  const deliveryMoment = useSelectedDeliveryMoment();

  return computed(() => {
    const {values} = form;

    if (deliveryOptions.loading.value || (!pickupLocation.location.value && !deliveryMoment.value)) {
      return undefined;
    }

    if (isDef(pickupLocation.location.value)) {
      const {carrier, openingHours, ...location} = pickupLocation.location.value;

      return {
        carrier,
        date: undefined,
        deliveryType: DeliveryTypeName.Pickup,
        isPickup: true,
        packageType: PackageTypeName.Package,
        pickupLocation: location,
        shipmentOptions: {},
      } satisfies PickupOutput;
    }

    const parsedMoment = parseJson<SelectedDeliveryMoment>(values[FIELD_DELIVERY_MOMENT]);
    const showDeliveryDate = getResolvedValue(ConfigSetting.ShowDeliveryDate);
    const shipmentOptions = values[FIELD_SHIPMENT_OPTIONS] ?? [];

    const deliveryType: DeliveryDeliveryType = DELIVERY_DELIVERY_TYPES.includes(parsedMoment.deliveryType)
      ? (parsedMoment.deliveryType as DeliveryDeliveryType)
      : DeliveryTypeName.Standard;

    return {
      carrier: parsedMoment.carrier,
      date: showDeliveryDate ? parsedMoment?.date : undefined,
      deliveryType,
      isPickup: false,
      packageType: parsedMoment.packageType,
      shipmentOptions: {
        signature: shipmentOptions.includes(ShipmentOptionName.Signature) ?? false,
        onlyRecipient: shipmentOptions.includes(ShipmentOptionName.OnlyRecipient) ?? false,
      },
    } satisfies DeliveryOutput;
  });
};
