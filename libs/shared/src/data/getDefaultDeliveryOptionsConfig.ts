import {type DeliveryOptionsConfig} from '../types';
import {CarrierSetting, ConfigSetting, PickupLocationsView} from '../enums';
import {
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  PACKAGE_TYPE_DEFAULT,
  PLATFORM_DEFAULT,
} from './settingsConsts';
import {getDefaultCarrierSettings} from './getDefaultCarrierSettings';

export const getDefaultDeliveryOptionsConfig = (): DeliveryOptionsConfig => {
  return {
    ...getDefaultCarrierSettings(),

    [ConfigSetting.Platform]: PLATFORM_DEFAULT,
    [ConfigSetting.Locale]: 'nl',
    [ConfigSetting.Currency]: 'EUR',
    [ConfigSetting.ApiBaseUrl]: 'https://api.myparcel.nl',

    [ConfigSetting.ShowPrices]: true,
    [ConfigSetting.ShowPriceSurcharge]: false,
    [ConfigSetting.ShowDeliveryDate]: true,

    [CarrierSetting.PackageType]: PACKAGE_TYPE_DEFAULT,

    // Drop-off
    [CarrierSetting.DropOffDays]: [1, 2, 3, 4, 5],
    [CarrierSetting.DeliveryDaysWindow]: DELIVERY_DAYS_WINDOW_DEFAULT,
    [CarrierSetting.DropOffDelay]: DROP_OFF_DELAY_DEFAULT,

    // Delivery
    [CarrierSetting.AllowDeliveryOptions]: true,
    [CarrierSetting.AllowStandardDelivery]: true,
    [CarrierSetting.AllowEveningDelivery]: true,
    [CarrierSetting.AllowMorningDelivery]: true,
    [CarrierSetting.AllowMondayDelivery]: true,
    [CarrierSetting.AllowSameDayDelivery]: true,
    [CarrierSetting.AllowOnlyRecipient]: true,
    [CarrierSetting.AllowSignature]: true,

    // Pickup
    [CarrierSetting.AllowPickupLocations]: true,

    [ConfigSetting.PickupLocationsDefaultView]: PickupLocationsView.Map,
    [ConfigSetting.PickupShowDistance]: true,

    /**
     * Default leaflet tile layer data.
     */
    [ConfigSetting.PickupLocationsMapTileLayerData]: JSON.stringify({
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      // eslint-disable-next-line max-len,vue/max-len
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      maxZoom: 19,
    }),

    carrierSettings: {},
  };
};
