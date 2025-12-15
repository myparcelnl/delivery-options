import {type ComputedRef, computed, toValue} from 'vue';
import {type SelectOption, DELIVERY_TYPE_DEFAULT} from '@myparcel-dev/shared';
import {getDeliveryTypePrice, createPackageTypeTranslatable} from '../utils';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES, SHOWN_SHIPMENT_OPTIONS} from '../data';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';
import {useActiveCarriers} from './useActiveCarriers';

export const useDeliveryMomentOptions = (): ComputedRef<SelectOption<string>[]> => {
  const {state: config} = useConfigStore();
  const deliveryMoments = useResolvedDeliveryMoments();
  const activeCarriers = useActiveCarriers();

  return computed(() => {
    // Some package types will not return any date/time moments from the API - we show one option per carrier instead without any date/time.
    if (!DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType)) {
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

    // Parse the deliveryMoments from the API for the other package types
    return deliveryMoments.value
      .filter((option) => option.packageType === config.packageType)
      .map((option) => {
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
