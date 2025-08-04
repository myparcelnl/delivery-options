import {assign} from 'radash';
import {
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_INITIAL,
  KEY_STRINGS,
  KEY_PLATFORM_CONFIG,
} from '@myparcel-do/shared';

export const getConfigFromWindow = (): InputDeliveryOptionsConfiguration => {
  console.log('getConfigFromWindow called');
  return assign<InputDeliveryOptionsConfiguration>(
    {
      // @ts-expect-error todo
      [KEY_ADDRESS]: {},
      [KEY_CONFIG]: {},
      [KEY_STRINGS]: {},
      [KEY_INITIAL]: {},
      [KEY_PLATFORM_CONFIG]: {carriers: []},
    },
    window.MyParcelConfig ?? {},
  );
};
