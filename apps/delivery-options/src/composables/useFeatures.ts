import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {ConfigSetting, LimitedPackageTypeName} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';
import {SHOWN_SHIPMENT_OPTIONS} from '../data';

const PACKAGE_TYPE_DEFAULT = [LimitedPackageTypeName.Package, LimitedPackageTypeName.PackageSmall];

export const useFeatures = useMemoize(() => {
  const config = useConfigStore();
  return {
    availableShipmentOptions: computed(() => {
      return PACKAGE_TYPE_DEFAULT.includes(config.packageType as unknown as LimitedPackageTypeName)
        ? SHOWN_SHIPMENT_OPTIONS
        : [];
    }),

    showDeliveryDate: computed(() => {
      return (
        PACKAGE_TYPE_DEFAULT.includes(config.packageType as unknown as LimitedPackageTypeName) &&
        config[ConfigSetting.ShowDeliveryDate]
      );
    }),
  };
});
