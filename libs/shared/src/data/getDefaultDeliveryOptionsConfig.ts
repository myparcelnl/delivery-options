import {type DeliveryOptionsConfig} from '../types';
import {PickupLocationsView} from '../enums';
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

    platform: PLATFORM_DEFAULT,
    locale: 'nl',
    currency: 'EUR',
    apiBaseUrl: 'https://api.myparcel.nl',

    showPrices: true,
    showPriceSurcharge: false,

    packageType: PACKAGE_TYPE_DEFAULT,

    // Drop-off
    deliveryDaysWindow: DELIVERY_DAYS_WINDOW_DEFAULT,
    dropOffDelay: DROP_OFF_DELAY_DEFAULT,

    // Delivery
    allowDeliveryOptions: true,
    allowStandardDelivery: true,
    allowEveningDelivery: true,
    allowMorningDelivery: true,
    allowMondayDelivery: true,
    allowSameDayDelivery: true,
    allowOnlyRecipient: true,
    allowSignature: true,

    // Pickup
    allowPickupLocations: true,

    pickupLocationsDefaultView: PickupLocationsView.Map,
    pickupShowDistance: true,
    showDeliveryDate: true,

    /**
     * Default leaflet tile layer data.
     */
    pickupLocationsMapTileLayerData: JSON.stringify({
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      // eslint-disable-next-line max-len,vue/max-len
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      maxZoom: 19,
    }),

    carrierSettings: {},
  };
};
