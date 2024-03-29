import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting, PACKAGE_TYPE_DEFAULT} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';

export const useFeatures = useMemoize(() => {
  const config = useConfigStore();

  return {
    availableShipmentOptions: computed(() => {
      return PACKAGE_TYPE_DEFAULT === config.packageType ? SHOWN_SHIPMENT_OPTIONS : [];
    }),

    showDeliveryDate: computed(() => {
      return PACKAGE_TYPE_DEFAULT === config.packageType && config[ConfigSetting.ShowDeliveryDate];
    }),
  };
});
