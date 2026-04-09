import {computed, type ComputedRef, toValue} from 'vue';
import {
  ONLY_RECIPIENT_TITLE,
  PRIORITY_DELIVERY_TITLE,
  type SelectOption,
  SIGNATURE_TITLE,
} from '@myparcel-dev/do-shared';
import {ShipmentOptionName} from '@myparcel-dev/constants';
import {getConfigPriceKey, getResolvedValue} from '../utils';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';

const TRANSLATION_MAP = Object.freeze({
  [ShipmentOptionName.AgeCheck]: 'age_check',
  [ShipmentOptionName.Collect]: 'collect',
  [ShipmentOptionName.CooledDelivery]: 'cooled_delivery',
  [ShipmentOptionName.Insurance]: 'insurance',
  [ShipmentOptionName.LargeFormat]: 'large_format',
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
  [ShipmentOptionName.PrinterlessReturn]: 'printerless_return',
  [ShipmentOptionName.PriorityDelivery]: PRIORITY_DELIVERY_TITLE,
  [ShipmentOptionName.Return]: 'return',
  [ShipmentOptionName.SameDayDelivery]: 'same_day_delivery',
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
} as const);

export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const {availableShipmentOptions} = useFeatures();

  const deliveryOptions = useResolvedDeliveryOptions();
  const deliveryMoment = useSelectedDeliveryMoment();

  return computed(() => {
    if (deliveryOptions.loading.value || !deliveryMoment.value?.carrier) {
      return [];
    }

    const {carrier, shipmentOptions} = useResolvedCarrier(deliveryMoment.value.carrier);

    const momentShipmentOptions = toValue(deliveryMoment)?.shipmentOptions;

    return availableShipmentOptions.value
      .filter((option) => {
        const carrierShipmentOptions = toValue(shipmentOptions);

        // If there are no delivery moments, show all available options from capabilities
        if (!momentShipmentOptions?.length) {
          return carrierShipmentOptions.has(option);
        }

        // Otherwise, only show options that are in capabilities AND in the API response
        return carrierShipmentOptions.has(option) && momentShipmentOptions?.some(({name}) => name === option);
      })
      .map((name) => {
        const match = momentShipmentOptions?.find((option) => option.name === name);

        const hasOnlyOneOption = match?.schema.enum.length === 1;

        const priceKey = getConfigPriceKey(name);

        return {
          label: TRANSLATION_MAP[name],
          value: name,
          disabled: hasOnlyOneOption,
          selected: hasOnlyOneOption ? match?.schema.enum[0] : false,
          price: getResolvedValue(priceKey, carrier.value?.identifier) ?? undefined,
        } satisfies SelectOption;
      });
  });
};
