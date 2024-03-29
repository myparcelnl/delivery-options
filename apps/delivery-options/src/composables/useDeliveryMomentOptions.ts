import {type ComputedRef, computed, toValue} from 'vue';
import {
  type SelectOption,
  PACKAGE_TYPE_DEFAULT,
  DELIVERY_TYPE_DEFAULT,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {getDeliveryTypePrice, createPackageTypeTranslatable} from '../utils';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';
import {useActiveCarriers} from './useActiveCarriers';

export const useDeliveryMomentOptions = (): ComputedRef<SelectOption[]> => {
  const config = useConfigStore();
  const deliveryMoments = useResolvedDeliveryMoments();
  const activeCarriers = useActiveCarriers();

  return computed(() => {
    if (PACKAGE_TYPE_DEFAULT !== config.packageType) {
      return activeCarriers.value
        .filter((carrier) => toValue(carrier.hasAnyDelivery) && toValue(carrier.packageTypes).has(config.packageType))
        .map((carrier) => {
          return {
            carrier: carrier.name,
            label: createPackageTypeTranslatable(config.packageType),
            price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrier.name),
            value: JSON.stringify({
              carrier: carrier.name,
              date: null,
              deliveryType: DELIVERY_TYPE_DEFAULT,
              packageType: config.packageType,
              shipmentOptions: [],
              time: null,
            }),
          };
        });
    }

    return deliveryMoments.value.map((option) => {
      return {
        carrier: option.carrier,
        label: option.time,
        price: getDeliveryTypePrice(option.deliveryType, option.carrier),
        value: JSON.stringify({
          time: option.time,
          carrier: option.carrier,
          date: option.date,
          deliveryType: option.deliveryType,
          packageType: option.packageType,
          shipmentOptions: option.shipmentOptions.filter((option) =>
            SHOWN_SHIPMENT_OPTIONS.includes(option.name as SupportedShipmentOptionName),
          ),
        }),
      };
    });
  });
};
