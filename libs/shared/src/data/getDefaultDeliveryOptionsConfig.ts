import {useNavigatorLanguage} from '@vueuse/core';
import {type ResolvedDeliveryOptionsConfig} from '../types';
import {
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  PACKAGE_TYPE_DEFAULT,
  PLATFORM_DEFAULT,
} from './settingsConsts';
import {getDefaultCarrierSettings} from './getDefaultCarrierSettings';
import {CarrierSetting, ConfigSetting, PickupLocationsView} from './enums';
import {
  DAY_MONDAY,
  DAY_TUESDAY,
  DAY_WEDNESDAY,
  DAY_THURSDAY,
  DAY_FRIDAY,
  SHIPMENT_OPTION_ALLOW_DEFAULTS,
} from './constants';
import {KEY_CARRIER_SETTINGS} from './config';

const DEFAULT_DROP_OFF_DAYS = [DAY_MONDAY, DAY_TUESDAY, DAY_WEDNESDAY, DAY_THURSDAY, DAY_FRIDAY] as const;

export const getDefaultDeliveryOptionsConfig = (): ResolvedDeliveryOptionsConfig => {
  const lang = useNavigatorLanguage();

  return {
    ...getDefaultCarrierSettings(),

    [ConfigSetting.Platform]: PLATFORM_DEFAULT,
    [ConfigSetting.Locale]: lang.language.value,
    [ConfigSetting.Currency]: 'EUR',
    [ConfigSetting.ApiBaseUrl]: 'https://api.myparcel.nl',
    [ConfigSetting.ProxyCapabilities]: '',

    [ConfigSetting.ShowPrices]: true,
    [ConfigSetting.ShowPriceSurcharge]: false,

    [CarrierSetting.PackageType]: PACKAGE_TYPE_DEFAULT,

    // Drop-off
    [CarrierSetting.DropOffDays]: DEFAULT_DROP_OFF_DAYS.map((weekday) => ({weekday})),
    [CarrierSetting.DeliveryDaysWindow]: DELIVERY_DAYS_WINDOW_DEFAULT,
    [CarrierSetting.DropOffDelay]: DROP_OFF_DELAY_DEFAULT,

    // Delivery
    [CarrierSetting.AllowStandardDelivery]: true,
    [CarrierSetting.AllowEveningDelivery]: true,
    [CarrierSetting.AllowMorningDelivery]: true,
    [CarrierSetting.AllowMondayDelivery]: true,
    [CarrierSetting.AllowSameDayDelivery]: true,
    ...SHIPMENT_OPTION_ALLOW_DEFAULTS,

    // Pickup
    [CarrierSetting.AllowPickupLocations]: true,

    // Misc. config
    [ConfigSetting.PickupLocationsDefaultView]: PickupLocationsView.Map,
    [ConfigSetting.AllowPickupLocationsViewSelection]: true,
    [ConfigSetting.PickupMapAllowLoadMore]: true,
    [ConfigSetting.PickupShowDistance]: true,
    [ConfigSetting.ShowPriceZeroAsFree]: false,
    [ConfigSetting.ClosedDays]: [],

    /**
     * Default leaflet tile layer data.
     */
    [ConfigSetting.PickupLocationsMapTileLayerData]: JSON.stringify({
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      // eslint-disable-next-line max-len,vue/max-len
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      maxZoom: 19,
    }),

    [KEY_CARRIER_SETTINGS]: {},
  };
};
