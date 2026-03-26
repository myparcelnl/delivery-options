import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {CarrierSetting, DELIVERY_DAYS_WINDOW_DEFAULT} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES, SHOWN_SHIPMENT_OPTIONS} from '../data';

export const useFeatures = useMemoize(() => {
  const {state: config} = useConfigStore();

  return {
    /**
     *  Only a subset of shipment options is available here
     */
    availableShipmentOptions: computed(() => {
      return SHOWN_SHIPMENT_OPTIONS;
    }),

    showDeliveryDate: computed(() => {
      const deliveryDaysWindow = config[CarrierSetting.DeliveryDaysWindow] ?? DELIVERY_DAYS_WINDOW_DEFAULT;

      return DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType) && deliveryDaysWindow > 1;
    }),
  };
});
