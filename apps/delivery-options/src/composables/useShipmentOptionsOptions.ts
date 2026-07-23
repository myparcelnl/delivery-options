import {computed, type ComputedRef} from 'vue';
import {SHIPMENT_OPTION_MAP, toCamelCase, type SelectOption} from '@myparcel-dev/do-shared';
import {getConfigPriceKey, getResolvedValue} from '../utils';
import {useShipmentOptionsState} from './useShipmentOptionsState';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedCarrier} from './useResolvedCarrier';

const TRANSLATION_MAP: Record<string, string> = Object.freeze(
  Object.fromEntries(Object.values(SHIPMENT_OPTION_MAP).map((sdk) => [sdk, `${toCamelCase(sdk)}Title`])),
);

/**
 * Build the shipment option checkboxes for the currently selected delivery moment. Which
 * options show and whether they are locked or pre-set is decided by useShipmentOptionsState;
 * this composable only adds the label and the price.
 */
export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();
  const deliveryMoment = useSelectedDeliveryMoment();
  const {optionStates} = useShipmentOptionsState();

  return computed(() => {
    const carrierId = deliveryMoment.value?.carrier;

    if (deliveryOptions.loading.value || !carrierId) {
      return [];
    }

    const {carrier} = useResolvedCarrier(carrierId);

    return optionStates.value.map(({name, disabled, selected}) => {
      const priceKey = getConfigPriceKey(name);

      return {
        label: TRANSLATION_MAP[name] ?? name,
        value: name,
        disabled,
        selected,
        price: getResolvedValue(priceKey, carrier.value?.identifier) ?? undefined,
      } satisfies SelectOption;
    });
  });
};
