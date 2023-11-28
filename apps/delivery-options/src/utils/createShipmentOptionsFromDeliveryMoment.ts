import {get} from '@vueuse/core';
import {type SelectOption} from '@myparcel-do/shared';
import {type ResolvedDeliveryOptions} from '../types';
import {SHOWN_SHIPMENT_OPTIONS} from '../constants';
import {useActiveCarrier} from '../composables/useActiveCarrier';

export const createShipmentOptionsFromDeliveryMoment = (
  deliveryOption: ResolvedDeliveryOptions | undefined,
): SelectOption[] => {
  const carrier = deliveryOption?.carrier.identifier;

  if (!carrier) {
    return [];
  }

  const resolvedCarrier = useActiveCarrier(carrier);

  return SHOWN_SHIPMENT_OPTIONS.filter((option) => {
    return resolvedCarrier.value.allowedShipmentOptions.value.includes(option);
  }).map((name) => {
    const match = get(deliveryOption)?.shipmentOptions?.find((option) => option.name === name);

    const hasOnlyOneOption = match?.schema.enum.length === 1;

    return {
      label: name,
      value: name,
      disabled: hasOnlyOneOption,
      selected: hasOnlyOneOption ? match?.schema.enum[0] : false,
    };
  });
};
