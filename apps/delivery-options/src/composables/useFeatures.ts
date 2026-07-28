import {computed, toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {CarrierSetting, DELIVERY_DAYS_WINDOW_DEFAULT, SUPPORTED_SHIPMENT_OPTIONS} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {useActiveCarriers} from './useActiveCarriers';

export const useFeatures = useMemoize(() => {
  const {state: config} = useConfigStore();
  const activeCarriers = useActiveCarriers();

  return {
    /**
     *  Only a subset of shipment options is available here
     */
    availableShipmentOptions: computed(() => {
      return SUPPORTED_SHIPMENT_OPTIONS;
    }),

    /**
     * Show the delivery-date selector when at least one active delivery carrier has a
     * delivery-days window of 1 or more. Each carrier's window falls back to the global
     * value, so a carrier without its own window inherits it. When every carrier has a
     * window of 0 there are no dates to pick and the selector stays hidden.
     */
    showDeliveryDate: computed(() => {
      if (!DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType)) {
        return false;
      }

      return activeCarriers.value.some(
        (carrier) =>
          toValue(carrier.hasDelivery) &&
          carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT) > 0,
      );
    }),
  };
});
