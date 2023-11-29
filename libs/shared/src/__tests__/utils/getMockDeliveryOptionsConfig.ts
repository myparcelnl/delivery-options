import {assign} from 'radash';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {PlatformName} from '@myparcel/constants';
import {type InputDeliveryOptionsConfiguration} from '../../types';
import {getDefaultConfiguration} from '../../config';

export const getMockDeliveryOptionsConfig = (
  config: RecursivePartial<InputDeliveryOptionsConfiguration> = {},
): InputDeliveryOptionsConfiguration => {
  return assign(getDefaultConfiguration(PlatformName.MyParcel), config) as InputDeliveryOptionsConfiguration;
};
