import type {InputDeliveryOptionsConfiguration} from '@myparcel-dev/do-shared';
import {describe, it, expect} from 'vitest';
import {mapDeprecatedUpsCarrierConfig} from './mapDeprecatedUpsCarrierConfig';

describe('mapDeprecatedUpsCarrierConfig', () => {
  const baseInput = (): InputDeliveryOptionsConfiguration => ({
    config: {
      carrierSettings: {},
    },
    address: {
      cc: 'NL',
      postalCode: '1234 AB',
      street: 'Teststraat 1',
      city: 'Amsterdam',
    },
  });

  it('returns input unchanged if no carrierSettings.ups is defined', () => {
    const input = baseInput();

    const result = mapDeprecatedUpsCarrierConfig(input);
    expect(result).toBe(input);
  });

  it('maps to both upsstandard and upsexpresssaver if both delivery types are allowed', () => {
    const input = {
      ...baseInput(),
      config: {carrierSettings: {ups: {allowStandardDelivery: true, allowExpressDelivery: true}}},
    };

    const outputConfig = mapDeprecatedUpsCarrierConfig(input);

    expect(outputConfig.config.carrierSettings?.upsstandard).toEqual({
      allowStandardDelivery: true,
      allowExpressDelivery: false,
    });
    expect(outputConfig.config.carrierSettings?.upsexpresssaver).toEqual({
      allowStandardDelivery: false,
      allowExpressDelivery: true,
    });
    expect(console.warn).toHaveBeenCalled();
    expect(outputConfig.config.carrierSettings?.ups).toBeUndefined();
  });

  it('maps only to upsstandard if only standard delivery is allowed', () => {
    const input = {...baseInput(), config: {carrierSettings: {ups: {allowStandardDelivery: true}}}};

    const outputConfig = mapDeprecatedUpsCarrierConfig(input);

    expect(outputConfig.config.carrierSettings?.upsexpresssaver).toEqual(undefined);
    expect(outputConfig.config.carrierSettings?.upsstandard).toEqual({
      allowStandardDelivery: true,
    });
    expect(console.warn).toHaveBeenCalled();
    expect(outputConfig.config.carrierSettings?.ups).toBeUndefined();
  });

  it('maps only to upsexpresssaver if only express delivery is allowed', () => {
    const input = {...baseInput(), config: {carrierSettings: {ups: {allowExpressDelivery: true}}}};

    const outputConfig = mapDeprecatedUpsCarrierConfig(input);

    expect(outputConfig.config.carrierSettings?.upsstandard).toEqual(undefined);
    expect(outputConfig.config.carrierSettings?.upsexpresssaver).toEqual({allowExpressDelivery: true});
    expect(console.warn).toHaveBeenCalled();
    expect(outputConfig.config.carrierSettings?.ups).toBeUndefined();
  });

  it('throws an error if both ups and upsStandard are defined', () => {
    const input = {...baseInput(), config: {carrierSettings: {ups: {}, upsstandard: {}}}};

    expect(() => mapDeprecatedUpsCarrierConfig(input)).toThrow(
      'Both ups and upsstandard or upsexpresssaver carrier settings are defined. Ups settings are deprecated and should not be used.',
    );
  });

  it('throws an error if both ups and upsStandard are defined', () => {
    const input = {...baseInput(), config: {carrierSettings: {ups: {}, upsexpresssaver: {}}}};

    expect(() => mapDeprecatedUpsCarrierConfig(input)).toThrow(
      'Both ups and upsstandard or upsexpresssaver carrier settings are defined. Ups settings are deprecated and should not be used.',
    );
  });
});
