import {assign} from 'radash';
import {
  AddressField,
  type DeliveryOptionsConfiguration,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {PlatformName} from '@myparcel/constants';
import {getDefaultConfigForPlatform, getDefaultStrings, validateConfiguration} from '../../config';

export const getMockDeliveryOptionsConfiguration = (
  input: RecursivePartial<InputDeliveryOptionsConfiguration> = {},
): DeliveryOptionsConfiguration => {
  return validateConfiguration(
    assign(
      {
        [KEY_ADDRESS]: {
          [AddressField.Country]: 'NL',
          [AddressField.Street]: 'Antareslaan 31',
          [AddressField.PostalCode]: '2132 JE',
          [AddressField.City]: 'Hoofddorp',
        },
        [KEY_CONFIG]: getDefaultConfigForPlatform(input.config?.platform ?? PlatformName.MyParcel),
        [KEY_STRINGS]: getDefaultStrings(),
      },
      input as InputDeliveryOptionsConfiguration,
    ),
  );
};
