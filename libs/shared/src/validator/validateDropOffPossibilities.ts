import {isOfType} from '@myparcel/ts-utils';
import {type CustomValidator, type DropOffEntry} from '../types';
import {CarrierSetting} from '../enums';
import {createValueMustBe} from './strings';

export const validateDropOffPossibilities = (): CustomValidator => {
  const keys = ['day', CarrierSetting.CutoffTime, CarrierSetting.CutoffTimeSameDay] satisfies (keyof DropOffEntry)[];

  return {
    validate(value) {
      return Array.isArray(value) && value.every((item) => keys.every((key) => isOfType<DropOffEntry>(item, key)));
    },
    error: createValueMustBe(`an array containing objects with keys: ${keys.join(', ')}`),
  };
};
