import {assign} from 'radash';
import {
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_INITIAL,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';

export const getConfigFromWindow = (): InputDeliveryOptionsConfiguration => {
  return assign<InputDeliveryOptionsConfiguration>(
    {
      // @ts-expect-error todo
      [KEY_ADDRESS]: {},
      [KEY_CONFIG]: {},
      [KEY_STRINGS]: {},
      [KEY_INITIAL]: {},
    },
    window.MyParcelConfig ?? {},
  );
};
