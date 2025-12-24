export * from './common-index';

export * from './components';
export * from './composables';
export * from './data';
export * from './stores';
export * from './utils';
export * from './views';

export {
  AddressField,
  CarrierSetting,
  ConfigSetting,
  CustomDeliveryType,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_INITIAL,
  KEY_STRINGS,
  PickupLocationsView,
  SUPPORTED_DELIVERY_TYPES,
  SUPPORTED_PACKAGE_TYPES,
  /**
   * @deprecated this will be removed when platforms are completely removed from the DO
   */
  SUPPORTED_PLATFORMS,
  SUPPORTED_SHIPMENT_OPTIONS,
} from '@myparcel-dev/do-shared';

export {bootDeliveryOptions} from './setup';
