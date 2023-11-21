import {getDefaultConfiguration, type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

export const getDefaultSandboxConfiguration = (): Omit<InputDeliveryOptionsConfiguration, 'components'> => {
  const defaults = getDefaultConfiguration(PlatformName.MyParcel);
  return {
    ...defaults,

    config: {
      ...defaults.config,
      carrierSettings: {
        [CarrierName.PostNl]: defaults.config,
        [CarrierName.DhlForYou]: defaults.config,
      },
    },

    address: {
      cc: 'NL',
      city: 'Hoofddorp',
      street: 'Antareslaan 31',
      postalCode: '2132 JE',
    },
  };
};
