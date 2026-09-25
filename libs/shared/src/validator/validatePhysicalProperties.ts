import {isObject} from 'radash';
import {type DeliveryOptionsPhysicalProperties} from '../types';
import {defineValidator} from './defineValidator';

export const validatePhysicalProperties = defineValidator(() => ({
  validate: (value: unknown): value is DeliveryOptionsPhysicalProperties | null => {
    if (value === null) return true;

    return isObject(value) && 'weight' in value && Number.isSafeInteger(value.weight) && Number(value.weight) > 0;
  },
  error: 'Expected null or a positive integer weight in grams',
  parse: (value: DeliveryOptionsPhysicalProperties | null): DeliveryOptionsPhysicalProperties | null =>
    value === null ? null : {weight: value.weight},
}));
