import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting} from '@myparcel-do/shared';
import {PackageTypeName} from '@myparcel/constants';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';

const PACKAGE_TYPE_DEFAULT = [PackageTypeName.Package, PackageTypeName.PackageSmall];

export const useFeatures = useMemoize(() => {
  const config = useConfigStore();

  return {
    availableShipmentOptions: computed(() => {
      return PACKAGE_TYPE_DEFAULT.includes(config.packageType) ? SHOWN_SHIPMENT_OPTIONS : [];
    }),

    showDeliveryDate: computed(() => {
      return PACKAGE_TYPE_DEFAULT.includes(config.packageType) && config[ConfigSetting.ShowDeliveryDate];
    }),
  };
});
