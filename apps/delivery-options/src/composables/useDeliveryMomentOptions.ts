import {type ComputedRef, computed, toValue} from 'vue';
import {type SelectOption, PACKAGE_TYPE_DEFAULT, DELIVERY_TYPE_DEFAULT} from '@myparcel-do/shared';
import {getDeliveryTypePrice, createPackageTypeTranslatable} from '../utils';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';
import {useActiveCarriers} from './useActiveCarriers';

export const useDeliveryMomentOptions = (): ComputedRef<SelectOption<string>[]> => {
  const config = useConfigStore();
  const deliveryMoments = useResolvedDeliveryMoments();
  const activeCarriers = useActiveCarriers();

  return computed(() => {
    if (PACKAGE_TYPE_DEFAULT !== config.packageType) {
      return activeCarriers.value
        .filter((carrier) => toValue(carrier.hasAnyDelivery) && toValue(carrier.packageTypes).has(config.packageType))
        .map((carrier) => {
          const carrierIdentifier = toValue(carrier.carrier).identifier;

          return {
            carrier: carrierIdentifier,
            label: createPackageTypeTranslatable(config.packageType),
            price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrierIdentifier),
            value: JSON.stringify({
              carrier: carrierIdentifier,
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
          shipmentOptions: option.shipmentOptions.filter((option) => SHOWN_SHIPMENT_OPTIONS.includes(option.name)),
        }),
      };
    });
  });
};
