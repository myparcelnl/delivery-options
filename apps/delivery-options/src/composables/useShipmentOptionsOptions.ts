import {computed, type ComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {
  ONLY_RECIPIENT_TITLE,
  type SelectOption,
  SIGNATURE_TITLE,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {getConfigPriceKey, getResolvedValue} from '../utils';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useLanguage} from './useLanguage';

const TRANSLATION_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
}) satisfies Record<SupportedShipmentOptionName, string>;

export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();
  const deliveryMoment = useSelectedDeliveryMoment();
  const {translate} = useLanguage();

  return computed(() => {
    const hasNoDeliveryOptions = deliveryOptions.loading.value || !deliveryOptions.value.length;
    const resolvedCarrier = useResolvedCarrier(deliveryMoment.value?.carrier);

    if (hasNoDeliveryOptions || !resolvedCarrier.value) {
      return [];
    }

    return SHOWN_SHIPMENT_OPTIONS.filter((option) => {
      return get(get(resolvedCarrier)?.allowedShipmentOptions)?.has(option);
    }).map((name) => {
      const match = get(deliveryMoment.value)?.shipmentOptions?.find((option) => option.name === name);

      const hasOnlyOneOption = match?.schema.enum.length === 1;

      const priceKey = getConfigPriceKey(name);

      return {
        label: translate(TRANSLATION_MAP[name]),
        value: name,
        disabled: hasOnlyOneOption,
        selected: hasOnlyOneOption ? match?.schema.enum[0] : false,
        price: getResolvedValue(priceKey, resolvedCarrier.value?.identifier) ?? undefined,
      } satisfies SelectOption;
    });
  });
};
