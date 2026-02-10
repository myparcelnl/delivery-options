import {computed, type ComputedRef} from 'vue';
import {isDef} from '@vueuse/core';
import {
  ConfigSetting,
  type DeliveryOutput,
  type PickupOutput,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  getConfigKey,
  type CarrierIdentifier,
} from '@myparcel-dev/do-shared';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useSelectedValues} from '../useSelectedValues';
import {useSelectedPickupLocation} from '../useSelectedPickupLocation';
import {useResolvedDeliveryOptions} from '../useResolvedDeliveryOptions';
import {getResolvedValue, parseJson} from '../../utils';
import {type SelectedDeliveryMomentDelivery} from '../../types';
import {useConfigStore} from '../../stores';
import {FIELD_DELIVERY_MOMENT, FIELD_SHIPMENT_OPTIONS, HOME_OR_PICKUP_PICKUP} from '../../data';

const DELIVERY_DELIVERY_TYPES = Object.freeze([
  DeliveryTypeName.Morning,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Standard,
] satisfies SupportedDeliveryTypeName[]);

const SHIPMENT_OPTION_OUTPUT_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: 'signature',
  [ShipmentOptionName.OnlyRecipient]: 'onlyRecipient',
  [ShipmentOptionName.PriorityDelivery]: 'priorityDelivery',
} as Record<SupportedShipmentOptionName, keyof DeliveryOutput['shipmentOptions']>);

/**
 * Given an array of sipmentOptions, create an object with only the shipmentOptions that are enabled for the carrier.
 *
 * @param carrier
 * @param shipmentOptions
 * @returns
 */
const createResolvedShipmentOptions = (
  carrier: CarrierIdentifier,
  shipmentOptions: string[],
): DeliveryOutput['shipmentOptions'] => {
  return Object.entries(SHIPMENT_OPTION_OUTPUT_MAP).reduce((acc, [shipmentOption, objectKey]) => {
    const enabledKey = getConfigKey(shipmentOption as SupportedShipmentOptionName);
    const enabled = getResolvedValue(enabledKey, carrier, false);

    if (enabled) {
      acc[objectKey] = shipmentOptions.includes(shipmentOption);
    }

    return acc;
  }, {} as DeliveryOutput['shipmentOptions']);
};

export const useResolvedValues = (): ComputedRef<PickupOutput | DeliveryOutput | undefined> => {
  const selectedValues = useSelectedValues();
  const deliveryOptions = useResolvedDeliveryOptions();
  const pickupLocation = useSelectedPickupLocation();

  return computed(() => {
    if (
      deliveryOptions.loading.value ||
      (!selectedValues.pickupLocation.value && !selectedValues.deliveryMoment.value)
    ) {
      return undefined;
    }

    if (selectedValues.homeOrPickup.value === HOME_OR_PICKUP_PICKUP && isDef(pickupLocation.location.value)) {
      const {carrier, openingHours, ...location} = pickupLocation.location.value;
      const {state: config} = useConfigStore();

      return {
        carrier,
        date: undefined,
        deliveryType: DeliveryTypeName.Pickup,
        isPickup: true,
        packageType: config.packageType,
        pickupLocation: location,
        shipmentOptions: {},
      } satisfies PickupOutput;
    }

    const parsedMoment = parseJson<SelectedDeliveryMomentDelivery>(selectedValues[FIELD_DELIVERY_MOMENT].value);
    const showDeliveryDate = getResolvedValue(ConfigSetting.ShowDeliveryDate, undefined, true);
    const shipmentOptions = selectedValues[FIELD_SHIPMENT_OPTIONS].value ?? [];

    const deliveryType = DELIVERY_DELIVERY_TYPES.includes(parsedMoment.deliveryType)
      ? parsedMoment.deliveryType
      : DeliveryTypeName.Standard;

    return {
      carrier: parsedMoment.carrier,
      date: showDeliveryDate ? parsedMoment?.date : undefined,
      deliveryType,
      isPickup: false,
      packageType: parsedMoment.packageType,
      shipmentOptions: createResolvedShipmentOptions(parsedMoment.carrier, shipmentOptions),
    } satisfies DeliveryOutput;
  });
};
