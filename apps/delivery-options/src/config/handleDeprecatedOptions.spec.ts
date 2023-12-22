import {describe, expect, it} from 'vitest';
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
} from '@myparcel-do/shared';
import {handleDeprecatedOptions} from './handleDeprecatedOptions';

describe('handleDeprecatedOptions', () => {
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
        DAY_MONDAY,
        DAY_TUESDAY,
        DAY_THURSDAY,
        {
          weekday: DAY_FRIDAY,
          cutoffTime: '12:00',
        },
        {
          weekday: DAY_SATURDAY,
          cutoffTime: '13:00',
        },
      ] satisfies DropOffEntry[]);
    });

    it('ignores and removes deprecated values if drop off days are passed as DropOffEntry objects without related days', () => {
      const config = {
        [DeprecatedCarrierSetting.FridayCutoffTime]: '12:00',
        [DeprecatedCarrierSetting.SaturdayCutoffTime]: '13:00',
        [CarrierSetting.CutoffTimeSameDay]: '08:00',
        [CarrierSetting.DropOffDays]: [
          {
            weekday: DAY_TUESDAY,
            cutoffTime: '08:00',
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
          weekday: DAY_TUESDAY,
          cutoffTime: '08:00',
        },
      ] satisfies DropOffEntry[]);
    });
  });
});
