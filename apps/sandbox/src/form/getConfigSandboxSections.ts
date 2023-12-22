import {KEY_CONFIG, OptionGroup} from '@myparcel-do/shared';
import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {resolveSandboxSection} from './resolveSandboxSection';

const CONFIG_GROUPS = Object.freeze([
  {
    name: OptionGroup.Delivery,
    items: [
      CarrierSetting.AllowDeliveryOptions,

      CarrierSetting.AllowMorningDelivery,
      CarrierSetting.AllowEveningDelivery,
      CarrierSetting.AllowSameDayDelivery,

      CarrierSetting.AllowMondayDelivery,
      CarrierSetting.AllowSaturdayDelivery,

      CarrierSetting.AllowOnlyRecipient,
      CarrierSetting.AllowSignature,

      CarrierSetting.AllowPackageTypeDigitalStamp,
      CarrierSetting.AllowPackageTypeMailbox,
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
