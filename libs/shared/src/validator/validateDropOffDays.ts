import {isNumber} from 'radash';
import {isOfType} from '@myparcel/ts-utils';
import {type DropOffEntryObject} from '../types';
import {
  DAY_SATURDAY,
  DAY_SUNDAY,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_SAME_DAY_CUTOFF_TIME,
  DROP_OFF_WEEKDAY,
} from '../data/constants';
import {CarrierSetting} from '../data';
import {validateIsTime} from './validateIsTime';
import {validateIsInRange} from './validateIsInRange';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

const DROP_OFF_KEYS = [
  DROP_OFF_WEEKDAY,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_SAME_DAY_CUTOFF_TIME,
] as const satisfies (keyof DropOffEntryObject)[];

export const validateDropOffDays = defineValidator(() => {
  return {
    validate(value): value is DropOffEntryObject[] {
      return (
        Array.isArray(value) &&
        value.every((item) => {
          const isDropOffObject = isOfType<DropOffEntryObject>(item, DROP_OFF_WEEKDAY);
          const isWeekday = isNumber(item);

          if (!isWeekday && !isDropOffObject) {
            return false;
          }

          const rangeValidator = validateIsInRange(DAY_SUNDAY, DAY_SATURDAY);

          if (!isDropOffObject) {
            return rangeValidator.validate(item);
          }

          const timeValidator = validateIsTime();

          return (
            rangeValidator.validate(item[DROP_OFF_WEEKDAY]) &&
            (item.cutoffTime ? timeValidator.validate(item.cutoffTime) : true) &&
            (item[CarrierSetting.CutoffTimeSameDay]
              ? timeValidator.validate(item[CarrierSetting.CutoffTimeSameDay])
              : true)
          );
        })
      );
    },

    error: createValueMustBe(`an array containing numbers and/or objects with keys: ${DROP_OFF_KEYS.join(', ')}`),
  };
});
