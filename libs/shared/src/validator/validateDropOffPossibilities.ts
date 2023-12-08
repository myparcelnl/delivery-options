import {isOfType} from '@myparcel/ts-utils';
import {type CustomValidator, type DropOffEntry} from '../types';
import {DROP_OFF_CUTOFF_TIME, DROP_OFF_DAY, DROP_OFF_SAME_DAY_CUTOFF_TIME} from '../constants';
import {validateIsTime} from './validateIsTime';
import {validateIsNumeric} from './validateIsNumeric';
import {createValueMustBe} from './strings';

const DROP_OFF_KEYS = [
  DROP_OFF_DAY,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_SAME_DAY_CUTOFF_TIME,
] as const satisfies (keyof DropOffEntry)[];

export const validateDropOffPossibilities = (): CustomValidator => {
  return {
    validate(value) {
      return (
        Array.isArray(value) &&
        value.every((item) => {
          const isDropOffDay = isOfType<DropOffEntry>(item, DROP_OFF_DAY);

          if (!isDropOffDay) {
            return false;
          }

          const numericValidator = validateIsNumeric();
          const timeValidator = validateIsTime();

          return (
            numericValidator.validate(item.day) &&
            (item.cutoffTime ? timeValidator.validate(item.cutoffTime) : true) &&
            (item.sameDayCutoffTime ? timeValidator.validate(item.sameDayCutoffTime) : true)
          );
        })
      );
    },
    error: createValueMustBe(`an array containing objects with keys: ${DROP_OFF_KEYS.join(', ')}`),
  };
};
