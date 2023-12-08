import {describe, expect, it} from 'vitest';
import {
  CarrierSetting,
  CUTOFF_TIME_SAME_DAY,
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  DAY_THURSDAY,
  DAY_TUESDAY,
  DeprecatedCarrierSetting,
  DROP_OFF_DAYS,
  type DropOffEntry,
  FRIDAY_CUTOFF_TIME,
  type InputDeliveryOptionsConfig,
  SATURDAY_CUTOFF_TIME,
} from '@myparcel-do/shared';
import {handleDeprecatedOptions} from './handleDeprecatedOptions';

describe('handleDeprecatedOptions', () => {
  describe('allow show delivery date', () => {
    it.each([true, false])(
      `converts ${DeprecatedCarrierSetting.AllowShowDeliveryDate} to ${CarrierSetting.ShowDeliveryDate}`,
      (value) => {
        const config = {
          [DeprecatedCarrierSetting.AllowShowDeliveryDate]: value,
        } satisfies InputDeliveryOptionsConfig;

        const resolved = handleDeprecatedOptions(config);

        expect(Object.keys(resolved)).not.toContain(DeprecatedCarrierSetting.AllowShowDeliveryDate);
        expect(Object.keys(resolved)).toContain(CarrierSetting.ShowDeliveryDate);
        expect(resolved[CarrierSetting.ShowDeliveryDate]).toBe(value);
      },
    );
  });

  describe('drop off properties', () => {
    it('converts legacy drop off properties to new format', () => {
      const config = {
        [DROP_OFF_DAYS]: '1;2;4;5;6',
        [FRIDAY_CUTOFF_TIME]: '12:00',
        [SATURDAY_CUTOFF_TIME]: '13:00',
        [CUTOFF_TIME_SAME_DAY]: '08:00',
      } satisfies InputDeliveryOptionsConfig;

      const resolved = handleDeprecatedOptions(config);

      expect(Object.keys(resolved)).not.toContain([FRIDAY_CUTOFF_TIME, SATURDAY_CUTOFF_TIME]);

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
        [FRIDAY_CUTOFF_TIME]: '12:00',
        [SATURDAY_CUTOFF_TIME]: '13:00',
        [CUTOFF_TIME_SAME_DAY]: '08:00',
        [DROP_OFF_DAYS]: [
          {
            weekday: DAY_TUESDAY,
            cutoffTime: '08:00',
          },
        ],
      } satisfies InputDeliveryOptionsConfig;

      const validated = handleDeprecatedOptions(config);

      expect(Object.keys(validated)).not.toContain([FRIDAY_CUTOFF_TIME, SATURDAY_CUTOFF_TIME]);

      expect(validated.dropOffDays).toEqual([
        {
          weekday: DAY_TUESDAY,
          cutoffTime: '08:00',
        },
      ] satisfies DropOffEntry[]);
    });
  });
});
