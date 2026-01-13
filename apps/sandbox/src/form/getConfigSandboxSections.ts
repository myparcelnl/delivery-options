import {CarrierSetting, OptionGroup, type CarrierIdentifier} from '@myparcel-dev/do-shared';
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
        name: OptionGroup.ShipmentOptionsPerPackageType,
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

export const getConfigSandboxSections = (carrierName: CarrierIdentifier): SettingsSection[] => {
  return CONFIG_GROUPS.map((group) => resolveSandboxSection(group, carrierName));
};
