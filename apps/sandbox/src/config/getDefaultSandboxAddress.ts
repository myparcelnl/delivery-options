import {type DeliveryOptionsAddress} from '@myparcel-dev/do-shared';

export const getDefaultSandboxAddress = (): DeliveryOptionsAddress => {
  return {
    cc: 'NL',
    street: 'Antareslaan 31',
    postalCode: '2132 JE',
    city: 'Hoofddorp',
  };
};
