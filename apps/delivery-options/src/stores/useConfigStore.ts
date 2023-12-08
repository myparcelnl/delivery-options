import {assign} from 'radash';
import {defineStore} from 'pinia';
import {
  type CarrierSettings,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  type DeliveryOptionsConfig,
  DROP_OFF_DELAY_DEFAULT,
  getDefaultConfigForPlatform,
  PACKAGE_TYPE_DEFAULT,
  PickupLocationsView,
  PLATFORM_DEFAULT,
} from '@myparcel-do/shared';

const allCarrierSettingsKeys = Object.freeze({
  allowDeliveryOptions: undefined,
  allowEveningDelivery: undefined,
  allowMondayDelivery: undefined,
  allowMorningDelivery: undefined,
  allowOnlyRecipient: undefined,
  allowPackageTypeDigitalStamp: undefined,
  allowPackageTypeMailbox: undefined,
  allowPackageTypePackage: undefined,
  allowPickupLocations: undefined,
  allowSameDayDelivery: undefined,
  allowSaturdayDelivery: undefined,
  allowSignature: undefined,
  allowStandardDelivery: undefined,
  deliveryDaysWindow: undefined,
  dropOffDelay: undefined,
  dropOffPossibilities: undefined,
  packageType: undefined,
  priceEveningDelivery: undefined,
  priceMondayDelivery: undefined,
  priceMorningDelivery: undefined,
  priceOnlyRecipient: undefined,
  pricePackageTypeDigitalStamp: undefined,
  pricePackageTypeMailbox: undefined,
  pricePickup: undefined,
  priceSameDayDelivery: undefined,
  priceSaturdayDelivery: undefined,
  priceSignature: undefined,
  priceStandardDelivery: undefined,
  showDeliveryDate: undefined,
}) satisfies Required<Record<keyof CarrierSettings, undefined>>;

/**
 * @see setConfiguration for changing the configuration.
 */
export const useConfigStore = defineStore('config', {
  state: (): DeliveryOptionsConfig => {
    return {
      ...allCarrierSettingsKeys,

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
  },

  actions: {
    update(configuration: DeliveryOptionsConfig): void {
      configuration.platform ??= PLATFORM_DEFAULT;

      Object.assign(this, assign(getDefaultConfigForPlatform(configuration.platform), configuration));
    },
  },
});
