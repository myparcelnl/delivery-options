import {get} from '@vueuse/core';
import {type SelectOption} from '@myparcel-do/shared';
import {type ResolvedDeliveryOptions} from '../types';
import {SHOWN_SHIPMENT_OPTIONS} from '../constants';
import {hasShipmentOption} from './hasShipmentOption';

export const createShipmentOptionsFromDeliveryMoment = (
  deliveryOption: ResolvedDeliveryOptions | undefined,
): SelectOption[] => {
  return SHOWN_SHIPMENT_OPTIONS.filter((option) => hasShipmentOption(option)).map((name) => {
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
