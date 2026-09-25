import {computed, toValue, type ComputedRef} from 'vue';
import {isDef} from '@vueuse/core';
import {
  CarrierSetting,
  CustomDeliveryType,
  SHIPMENT_OPTION_MAP,
  mapCarrierSettingToCapabilityKeys,
  toCamelCase,
  type DeliveryOutput,
  type PickupOutput,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  getConfigKey,
  type CarrierIdentifier,
} from '@myparcel-dev/do-shared';
import {NETHERLANDS} from '@myparcel-dev/constants/countries';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useSelectedValues} from '../useSelectedValues';
import {useSelectedPickupLocation} from '../useSelectedPickupLocation';
import {useResolvedDeliveryOptions} from '../useResolvedDeliveryOptions';
import {getResolvedCarrier, getResolvedValue, parseJson} from '../../utils';
import {type SelectedDeliveryMomentDelivery} from '../../types';
import {useAddressStore, useConfigStore} from '../../stores';
import {FIELD_DELIVERY_MOMENT, FIELD_SHIPMENT_OPTIONS, HOME_OR_PICKUP_PICKUP} from '../../data';

const DELIVERY_DELIVERY_TYPES = Object.freeze([
  DeliveryTypeName.Morning,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Standard,
] satisfies SupportedDeliveryTypeName[]);

const isDeliveryDeliveryType = (
  type: SupportedDeliveryTypeName | DeliveryTypeName,
): type is DeliveryTypeName.Morning | DeliveryTypeName.Evening | DeliveryTypeName.Standard =>
  (DELIVERY_DELIVERY_TYPES as readonly string[]).includes(type);

/**
 * A selected same-day moment is emitted the way the carrier's capabilities
 * represent it: as the same_day delivery type, or as the sameDayDelivery
 * shipment option combined with the delivery type the API assigned to the
 * moment before it was internally resolved to same_day.
 */
const resolveOutputDeliveryType = (
  parsedMoment: SelectedDeliveryMomentDelivery,
): {deliveryType: DeliveryOutput['deliveryType']; sameDayAsShipmentOption: boolean} => {
  if (parsedMoment.deliveryType !== CustomDeliveryType.SameDay) {
    return {
      deliveryType: isDeliveryDeliveryType(parsedMoment.deliveryType)
        ? parsedMoment.deliveryType
        : DeliveryTypeName.Standard,
      sameDayAsShipmentOption: false,
    };
  }

  const capability = toValue(getResolvedCarrier(parsedMoment.carrier).capability);
  const hasSameDayDeliveryType = mapCarrierSettingToCapabilityKeys(CarrierSetting.AllowSameDayDelivery).some(
    (entry) => entry.type === 'deliveryType' && Boolean(capability?.deliveryTypes.includes(entry.name)),
  );

  if (hasSameDayDeliveryType) {
    return {deliveryType: CustomDeliveryType.SameDay, sameDayAsShipmentOption: false};
  }

  const {originalDeliveryType} = parsedMoment;

  return {
    deliveryType:
      originalDeliveryType && isDeliveryDeliveryType(originalDeliveryType)
        ? originalDeliveryType
        : DeliveryTypeName.Standard,
    sameDayAsShipmentOption: true,
  };
};

const SHIPMENT_OPTION_OUTPUT_MAP = Object.freeze(
  Object.fromEntries(Object.values(SHIPMENT_OPTION_MAP).map((sdk) => [sdk, toCamelCase(sdk)])),
) as Record<SupportedShipmentOptionName, keyof DeliveryOutput['shipmentOptions']>;

/**
 * Given an array of sipmentOptions, create an object with only the shipmentOptions that are enabled for the carrier.
 *
 * @param carrier
 * @param shipmentOptions
 * @param countryCode
 * @returns
 */
const createResolvedShipmentOptions = (
  carrier: CarrierIdentifier,
  shipmentOptions: string[],
  countryCode: string,
): DeliveryOutput['shipmentOptions'] => {
  return Object.entries(SHIPMENT_OPTION_OUTPUT_MAP).reduce((acc, [shipmentOption, objectKey]) => {
    if (shipmentOption === ShipmentOptionName.PriorityDelivery && countryCode !== NETHERLANDS) {
      return acc;
    }

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
  const {state: address} = useAddressStore();

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
    const shipmentOptions = selectedValues[FIELD_SHIPMENT_OPTIONS].value ?? [];

    const {deliveryType, sameDayAsShipmentOption} = resolveOutputDeliveryType(parsedMoment);

    return {
      carrier: parsedMoment.carrier,
      date: parsedMoment?.date,
      deliveryType,
      isPickup: false,
      packageType: parsedMoment.packageType,
      shipmentOptions: {
        ...createResolvedShipmentOptions(parsedMoment.carrier, shipmentOptions, address.cc),
        ...(sameDayAsShipmentOption ? {sameDayDelivery: true} : {}),
      },
    } satisfies DeliveryOutput;
  });
};
