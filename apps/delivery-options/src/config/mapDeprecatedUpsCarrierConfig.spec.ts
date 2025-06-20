import type {InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {describe, it, expect} from 'vitest';
import {mapDeprecatedUpsCarrierConfig} from './mapDeprecatedUpsCarrierConfig';

describe('mapDeprecatedUpsCarrierConfig', () => {
  it('converts ups config to upsStandard config', () => {
    const inputConfig: InputDeliveryOptionsConfiguration = {
      config: {
        carrierSettings: {
          ups: {
            allowOnlyRecipient: true,
          },
        },
      },
      address: {
        cc: '',
        postalCode: '',
        street: '',
        city: '',
      },
    };

    const outputConfig = mapDeprecatedUpsCarrierConfig(inputConfig);

    expect(outputConfig.config.carrierSettings?.upsstandard).toEqual({allowOnlyRecipient: true});
    expect(console.warn).toHaveBeenCalled();
    expect(outputConfig.config.carrierSettings?.ups).toBeUndefined();
  });

  it('throws an error if both ups and upsStandard are defined', () => {
    const inputConfig: InputDeliveryOptionsConfiguration = {
      config: {
        carrierSettings: {
          ups: {},
          upsstandard: {},
        },
      },
      address: {
        cc: '',
        postalCode: '',
        street: '',
        city: '',
      },
    };

    expect(() => mapDeprecatedUpsCarrierConfig(inputConfig)).toThrow(
      'Both ups and upsstandard carrier settings are defined. Ups settings are deprecated and should not be used.',
    );
  });
});
