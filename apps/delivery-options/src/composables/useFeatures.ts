import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting, PACKAGE_TYPE_DEFAULT} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';

export const useFeatures = useMemoize(() => {
  const config = useConfigStore();
  const isDefaultPackageType = computed(() => PACKAGE_TYPE_DEFAULT === config.packageType);

  return {
    availableShipmentOptions: computed(() => (isDefaultPackageType.value ? SHOWN_SHIPMENT_OPTIONS : [])),
    showDeliveryDate: computed(() => isDefaultPackageType.value && config[ConfigSetting.ShowDeliveryDate]),
  };
});
