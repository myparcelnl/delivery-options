import {computed} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
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
import {useResolvedCarrier} from './useResolvedCarrier';
import {useLanguage} from './useLanguage';

const TRANSLATION_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
}) satisfies Record<SupportedShipmentOptionName, string>;

export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const deliveryMoment = useSelectedDeliveryMoment();

  return computed(() => {
    const carrier = deliveryMoment.value?.carrier;

    if (!carrier) {
      return [];
    }

    const {translate} = useLanguage();
    const resolvedCarrier = useResolvedCarrier(carrier);

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
        price: getResolvedValue(priceKey, carrier) ?? undefined,
      } satisfies SelectOption;
    });
  });
};
