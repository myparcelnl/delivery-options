import {crush} from 'radash';
import {getDefaultConfiguration} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

export const getDefaultSandboxConfiguration = (): Record<string, unknown> => {
  const defaults = getDefaultConfiguration(PlatformName.MyParcel);

  const configuration = {
    ...defaults,

    address: {
      cc: 'NL',
      city: 'Hoofddorp',
      street: 'Antareslaan 31',
      postalCode: '2132 JE',
    },
  };

  return crush(configuration) as Record<string, unknown>;
};
