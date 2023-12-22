import {assign} from 'radash';
import {
  ConfigSetting,
  type DeliveryOptionsConfig,
  getDefaultDeliveryOptionsConfig,
  PickupLocationsView,
  type SupportedPlatformName,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

const PLATFORM_DEFAULTS = Object.freeze({
  [PlatformName.MyParcel]: {
    [ConfigSetting.PickupShowDistance]: true,
    [ConfigSetting.PickupLocationsDefaultView]: PickupLocationsView.Map,
  },

  [PlatformName.SendMyParcel]: {
    [ConfigSetting.PickupShowDistance]: false,
    [ConfigSetting.PickupLocationsDefaultView]: PickupLocationsView.List,
  },
}) satisfies Readonly<Partial<Record<SupportedPlatformName, Partial<DeliveryOptionsConfig>>>>;

export const getDefaultConfigForPlatform = (
  platform: SupportedPlatformName = PlatformName.MyParcel,
): Partial<DeliveryOptionsConfig> => {
  return assign<Partial<DeliveryOptionsConfig>>(getDefaultDeliveryOptionsConfig(), PLATFORM_DEFAULTS?.[platform] ?? {});
};
