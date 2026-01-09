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
  [ShipmentOptionName.Signature]: SIGNATURE_TITLE,
  [ShipmentOptionName.OnlyRecipient]: ONLY_RECIPIENT_TITLE,
  [ShipmentOptionName.PriorityDelivery]: PRIORITY_DELIVERY_TITLE,
} as const);

export const useShipmentOptionsOptions = (): ComputedRef<SelectOption[]> => {
  const {availableShipmentOptions} = useFeatures();

  const deliveryOptions = useResolvedDeliveryOptions();
  const deliveryMoment = useSelectedDeliveryMoment();

  return computed(() => {
    const {carrier, shipmentOptionsPerPackageType} = useResolvedCarrier(deliveryMoment.value?.carrier);

    if (deliveryOptions.loading.value || !carrier.value) {
      return [];
    }

    const momentShipmentOptions = toValue(deliveryMoment)?.shipmentOptions;

    return availableShipmentOptions.value
      .filter((option) => {
        // TODO: create test coverage for this logic
        const selectedPackageType = toValue(deliveryMoment)?.packageType;
        const optionsForPackageType = selectedPackageType
          ? toValue(shipmentOptionsPerPackageType)[selectedPackageType]
          : undefined;

        // If there are no delivery moments (eg. fake delivery), show all available options for the package type
        if (!momentShipmentOptions?.length) {
          return optionsForPackageType ? optionsForPackageType.has(option) : false;
        }

        // Otherwise, only show options that are available for the package type AND in the delivery moments in the API response
        return optionsForPackageType
          ? optionsForPackageType.has(option) && momentShipmentOptions?.some(({name}) => name === option)
          : false;
      })
      .map((name) => {
        const match = momentShipmentOptions?.find((option) => option.name === name);

        const hasOnlyOneOption = match?.schema.enum.length === 1;

        const priceKey = getConfigPriceKey(name);

        return {
          // @ts-expect-error todo: fix this error
          label: TRANSLATION_MAP[name],
          value: name,
          disabled: hasOnlyOneOption,
          selected: hasOnlyOneOption ? match?.schema.enum[0] : false,
          price: getResolvedValue(priceKey, carrier.value?.identifier) ?? undefined,
        } satisfies SelectOption;
      });
  });
};
