import {get} from '@vueuse/core';
import {
  ONLY_RECIPIENT_TITLE,
  type SelectOption,
  SIGNATURE_TITLE,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../types';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';
import {useLanguage, useResolvedCarrier} from '../composables';
import {getResolvedValue} from './getResolvedValue';
import {getConfigPriceKey} from './getConfigPriceKey';

const TRANSLATION_MAP = Object.freeze({
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
}) satisfies Record<SupportedShipmentOptionName, string>;

export const createShipmentOptionsFromDeliveryMoment = (
  deliveryOption: SelectedDeliveryMoment | undefined,
): SelectOption[] => {
  const carrier = deliveryOption?.carrier;

  if (!carrier) {
    return [];
  }

  const {translate} = useLanguage();
  const resolvedCarrier = useResolvedCarrier(carrier);

  return SHOWN_SHIPMENT_OPTIONS.filter((option) => {
    return get(get(resolvedCarrier)?.allowedShipmentOptions)?.has(option);
  }).map((name) => {
    const match = get(deliveryOption)?.shipmentOptions?.find((option) => option.name === name);

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
};
