import './assets/index.scss';
import {bootDeliveryOptions} from './setup';

export * from './common-index';
export * from './data/events';

export {
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
  KEY_CARRIER_SETTINGS,
  KEY_INITIAL,
  CarrierSetting,
  ConfigSetting,
  AddressField,
} from '@myparcel-dev/do-shared';

bootDeliveryOptions();
