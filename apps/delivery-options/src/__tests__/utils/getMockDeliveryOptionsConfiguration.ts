import {assign} from 'radash';
import {type RecursivePartial} from '@myparcel-dev/ts-utils';
import {
  AddressField,
  type DeliveryOptionsConfiguration,
  type InputDeliveryOptionsConfiguration,
  getDefaultDeliveryOptionsConfig,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';
import {getDefaultStrings, validateConfiguration} from '../../config';

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
        [KEY_CONFIG]: getDefaultDeliveryOptionsConfig(),
        [KEY_STRINGS]: getDefaultStrings(),
      },
      input as InputDeliveryOptionsConfiguration,
    ),
  );
};
