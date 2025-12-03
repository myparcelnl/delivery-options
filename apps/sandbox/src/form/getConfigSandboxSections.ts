import {CarrierSetting, KEY_CONFIG, OptionGroup} from '@myparcel-dev/shared';
import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {resolveSandboxSection} from './resolveSandboxSection';

const CONFIG_GROUPS = Object.freeze([
  {
    name: OptionGroup.Delivery,
    items: [CarrierSetting.AllowDeliveryOptions],
    children: [
      {
        name: OptionGroup.DeliveryMoments,
        items: [
          CarrierSetting.AllowStandardDelivery,
          CarrierSetting.AllowExpressDelivery,
          CarrierSetting.AllowMorningDelivery,
          CarrierSetting.AllowEveningDelivery,
          CarrierSetting.AllowSameDayDelivery,
          CarrierSetting.AllowMondayDelivery,
          CarrierSetting.AllowSaturdayDelivery,
        ],
      },
      {
        name: OptionGroup.ShipmentOptions,
        items: [CarrierSetting.AllowOnlyRecipient, CarrierSetting.AllowSignature],
      },
      {
        name: OptionGroup.PackageTypes,
        items: [
          CarrierSetting.PricePackageTypeMailbox,
          CarrierSetting.PricePackageTypeDigitalStamp,
          CarrierSetting.PricePackageTypePackageSmall,
        ],
      },
    ],
  },

  {
    name: OptionGroup.Pickup,
    items: [CarrierSetting.AllowPickupLocations],
  },
] satisfies SandboxOptionGroup[]);

export const getConfigSandboxSections = (prefix?: string): SettingsSection[] => {
  return CONFIG_GROUPS.map((group) => resolveSandboxSection(group, KEY_CONFIG + (prefix ? `.${prefix}` : '')));
};
