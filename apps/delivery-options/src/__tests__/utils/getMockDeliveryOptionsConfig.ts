import {assign} from 'radash';
import {getDefaultConfiguration, type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {PlatformName} from '@myparcel/constants';

export const getMockDeliveryOptionsConfig = (
  config: RecursivePartial<InputDeliveryOptionsConfiguration> = {},
): InputDeliveryOptionsConfiguration => {
  return assign(
    getDefaultConfiguration(PlatformName.MyParcel),
    config as InputDeliveryOptionsConfiguration,
  ) as InputDeliveryOptionsConfiguration;
};
