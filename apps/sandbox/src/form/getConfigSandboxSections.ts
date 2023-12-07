import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  KEY_CONFIG,
  OptionGroup,
} from '@myparcel-do/shared';
import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {resolveSandboxSection} from './resolveSandboxSection';

const CONFIG_GROUPS = Object.freeze([
  {
    name: OptionGroup.Delivery,
    items: [
      ALLOW_DELIVERY_OPTIONS,

      ALLOW_MORNING_DELIVERY,
      ALLOW_EVENING_DELIVERY,
      ALLOW_SAME_DAY_DELIVERY,

      ALLOW_MONDAY_DELIVERY,
      ALLOW_SATURDAY_DELIVERY,

      ALLOW_ONLY_RECIPIENT,
      ALLOW_SIGNATURE,

      ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
      ALLOW_PACKAGE_TYPE_MAILBOX,
    ],
  },

  {
    name: OptionGroup.Pickup,
    items: [ALLOW_PICKUP_LOCATIONS],
  },
] satisfies SandboxOptionGroup[]);

export const getConfigSandboxSections = (prefix?: string): SettingsSection[] => {
  return CONFIG_GROUPS.map((group) => resolveSandboxSection(group, KEY_CONFIG + (prefix ? `.${prefix}` : '')));
};
