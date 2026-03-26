/* eslint-disable no-console */
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CarrierSetting, type InputDeliveryOptionsConfig} from '@myparcel-dev/do-shared';
import {handleDeprecatedOptions} from './handleDeprecatedOptions';

describe('handleDeprecatedOptions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  describe('allow standard delivery', () => {
    it.each([true, false])(
      `converts ${CarrierSetting.AllowDeliveryOptions} to ${CarrierSetting.AllowStandardDelivery} if the latter is missing`,
      (value) => {
        const config = {[CarrierSetting.AllowDeliveryOptions]: value} satisfies InputDeliveryOptionsConfig;

        const resolved = handleDeprecatedOptions(config);

        expect(Object.keys(resolved)).toContain(CarrierSetting.AllowDeliveryOptions);
        expect(Object.keys(resolved)).toContain(CarrierSetting.AllowStandardDelivery);
        expect(resolved[CarrierSetting.AllowDeliveryOptions]).toBe(value);
        expect(resolved[CarrierSetting.AllowStandardDelivery]).toBe(value);
      },
    );

    it(`warns if only ${CarrierSetting.AllowDeliveryOptions} is passed`, () => {
      const config = {
        [CarrierSetting.AllowDeliveryOptions]: true,
      } satisfies InputDeliveryOptionsConfig;

      handleDeprecatedOptions(config);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
