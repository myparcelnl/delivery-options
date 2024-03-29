import {computed, type ComputedRef, toValue} from 'vue';
import {
  ONLY_RECIPIENT_TITLE,
  type SelectOption,
  SIGNATURE_TITLE,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {getConfigPriceKey, getResolvedValue} from '../utils';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';

const TRANSLATION_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
}) satisfies Record<SupportedShipmentOptionName, string>;

export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const {availableShipmentOptions} = useFeatures();

  const deliveryOptions = useResolvedDeliveryOptions();
  const deliveryMoment = useSelectedDeliveryMoment();

  return computed(() => {
    const hasNoDeliveryOptions = deliveryOptions.loading.value || !deliveryOptions.value.length;
    const {carrier, shipmentOptions} = useResolvedCarrier(deliveryMoment.value?.carrier);

    if (hasNoDeliveryOptions || !carrier.value) {
      return [];
    }

    const carrierShipmentOptions = toValue(shipmentOptions);
    const momentShipmentOptions = toValue(deliveryMoment)?.shipmentOptions;

    return availableShipmentOptions.value
      .filter((option) => {
        return carrierShipmentOptions?.has(option) && momentShipmentOptions?.some(({name}) => name === option);
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
