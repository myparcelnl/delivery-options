import {type DeliveryOptionsConfig, type DeliveryOptionsConfiguration} from '../types';

export const KEY_ADDRESS = 'address' satisfies keyof DeliveryOptionsConfiguration;

export const KEY_CONFIG = 'config' satisfies keyof DeliveryOptionsConfiguration;

export const KEY_CARRIER_SETTINGS = 'carrierSettings' satisfies keyof DeliveryOptionsConfig;

export const KEY_STRINGS = 'strings' satisfies keyof DeliveryOptionsConfiguration;

export const KEY_INITIAL = 'initial' satisfies keyof DeliveryOptionsConfiguration;

export const KEY_PLATFORM_CONFIG = 'platformConfig' satisfies keyof DeliveryOptionsConfiguration;
