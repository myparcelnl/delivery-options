import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting} from '@myparcel-do/shared';
import {PackageTypeName} from '@myparcel/constants';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';

const SUPPORTED_PACKAGE_TYPES = [PackageTypeName.Package, PackageTypeName.PackageSmall];

export const useFeatures = useMemoize(() => {
  const {state: config} = useConfigStore();

  return {
    availableShipmentOptions: computed(() => {
      return SUPPORTED_PACKAGE_TYPES.includes(config.packageType) ? SHOWN_SHIPMENT_OPTIONS : [];
    }),

    showDeliveryDate: computed(() => {
      return SUPPORTED_PACKAGE_TYPES.includes(config.packageType) && config[ConfigSetting.ShowDeliveryDate];
    }),
  };
});
