/* eslint-disable no-console */
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  CarrierSetting,
  ConfigSetting,
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  DAY_THURSDAY,
  DAY_TUESDAY,
  DeprecatedCarrierSetting,
  type DropOffEntry,
  type InputDeliveryOptionsConfig,
  DROP_OFF_WEEKDAY,
  type DropOffEntryObject,
} from '@myparcel-do/shared';
import {handleDeprecatedOptions} from './handleDeprecatedOptions';

describe('handleDeprecatedOptions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('allow show delivery date', () => {
    it.each([true, false])(
      `converts ${DeprecatedCarrierSetting.AllowShowDeliveryDate} to ${ConfigSetting.ShowDeliveryDate}`,
      (value) => {
        const config = {
          [DeprecatedCarrierSetting.AllowShowDeliveryDate]: value,
        } satisfies InputDeliveryOptionsConfig;

        const resolved = handleDeprecatedOptions(config);

        expect(Object.keys(resolved)).not.toContain(DeprecatedCarrierSetting.AllowShowDeliveryDate);
        expect(Object.keys(resolved)).toContain(ConfigSetting.ShowDeliveryDate);
        expect(resolved[ConfigSetting.ShowDeliveryDate]).toBe(value);
      },
    );
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

  describe('drop off properties', () => {
    it('converts legacy drop off properties to new format', () => {
      const config = {
        [CarrierSetting.DropOffDays]: '1;2;4;5;6',
        [DeprecatedCarrierSetting.FridayCutoffTime]: '12:00',
        [DeprecatedCarrierSetting.SaturdayCutoffTime]: '13:00',
        [CarrierSetting.CutoffTimeSameDay]: '08:00',
      } satisfies InputDeliveryOptionsConfig;

      const resolved = handleDeprecatedOptions(config);

      expect(Object.keys(resolved)).not.toContain([
        DeprecatedCarrierSetting.FridayCutoffTime,
        DeprecatedCarrierSetting.SaturdayCutoffTime,
      ]);

      expect(resolved.dropOffDays).toEqual([
        {[DROP_OFF_WEEKDAY]: DAY_MONDAY},
        {[DROP_OFF_WEEKDAY]: DAY_TUESDAY},
        {[DROP_OFF_WEEKDAY]: DAY_THURSDAY},
        {[DROP_OFF_WEEKDAY]: DAY_FRIDAY, [CarrierSetting.CutoffTime]: '12:00'},
        {[DROP_OFF_WEEKDAY]: DAY_SATURDAY, [CarrierSetting.CutoffTime]: '13:00'},
      ] satisfies DropOffEntryObject[]);
    });

    it('ignores and removes deprecated values if drop off days are passed as DropOffEntry objects without related days', () => {
      const config = {
        [DeprecatedCarrierSetting.FridayCutoffTime]: '12:00',
        [DeprecatedCarrierSetting.SaturdayCutoffTime]: '13:00',
        [CarrierSetting.CutoffTimeSameDay]: '08:00',
        [CarrierSetting.DropOffDays]: [
          {
            [DROP_OFF_WEEKDAY]: DAY_TUESDAY,
            [CarrierSetting.CutoffTime]: '08:00',
          },
        ],
      } satisfies InputDeliveryOptionsConfig;

      const validated = handleDeprecatedOptions(config);

      expect(Object.keys(validated)).not.toContain([
        DeprecatedCarrierSetting.FridayCutoffTime,
        DeprecatedCarrierSetting.SaturdayCutoffTime,
      ]);

      expect(validated.dropOffDays).toEqual([
        {
          [DROP_OFF_WEEKDAY]: DAY_TUESDAY,
          [CarrierSetting.CutoffTime]: '08:00',
        },
      ] satisfies DropOffEntry[]);
    });
  });
});
