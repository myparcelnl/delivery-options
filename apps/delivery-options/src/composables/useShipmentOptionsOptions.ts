import {computed, type ComputedRef, toValue} from 'vue';
import {SHIPMENT_OPTION_MAP, toCamelCase, type SelectOption} from '@myparcel-dev/do-shared';
import {getConfigPriceKey, getResolvedValue} from '../utils';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';

const TRANSLATION_MAP: Record<string, string> = Object.freeze(
  Object.fromEntries(Object.values(SHIPMENT_OPTION_MAP).map((sdk) => [sdk, `${toCamelCase(sdk)}Title`])),
);

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
          label: TRANSLATION_MAP[name] ?? name,
          value: name,
          disabled: hasOnlyOneOption,
          selected: hasOnlyOneOption ? match?.schema.enum[0] : false,
          price: getResolvedValue(priceKey, carrier.value?.identifier) ?? undefined,
        } satisfies SelectOption;
      });
  });
};
