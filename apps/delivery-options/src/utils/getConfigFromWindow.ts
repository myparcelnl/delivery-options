import {assign} from 'radash';
import {
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_INITIAL,
  KEY_STRINGS,
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';

export const getConfigFromWindow = (): InputDeliveryOptionsConfiguration => {
  return assign<RecursivePartial<InputDeliveryOptionsConfiguration>>(
    {
      [KEY_ADDRESS]: {},
      [KEY_CONFIG]: {},
      [KEY_STRINGS]: {},
      [KEY_INITIAL]: {},
    },
    window.MyParcelConfig ?? {},
  );
};
