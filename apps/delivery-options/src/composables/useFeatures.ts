import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting} from '@myparcel-do/shared';
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
      return DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType) && config[ConfigSetting.ShowDeliveryDate];
    }),
  };
});
