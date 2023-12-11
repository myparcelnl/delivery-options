import {assign} from 'radash';
import {
  type DeliveryOptionsConfig,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  getDefaultDeliveryOptionsConfig,
  PickupLocationsView,
  type SupportedPlatformName,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

const PLATFORM_DEFAULTS = Object.freeze({
  [PlatformName.MyParcel]: {
    [FEATURE_PICKUP_SHOW_DISTANCE]: true,
    [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: PickupLocationsView.Map,
  },

  [PlatformName.SendMyParcel]: {
    [FEATURE_PICKUP_SHOW_DISTANCE]: false,
    [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: PickupLocationsView.List,
  },
}) satisfies Readonly<Partial<Record<SupportedPlatformName, Partial<DeliveryOptionsConfig>>>>;

export const getDefaultConfigForPlatform = (
  platform: SupportedPlatformName = PlatformName.MyParcel,
): Partial<DeliveryOptionsConfig> => {
  return assign<Partial<DeliveryOptionsConfig>>(getDefaultDeliveryOptionsConfig(), PLATFORM_DEFAULTS?.[platform] ?? {});
};
