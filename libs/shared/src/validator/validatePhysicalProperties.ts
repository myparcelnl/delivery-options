import {isObject} from 'radash';
import {type DeliveryOptionsPhysicalProperties} from '../types';
import {defineValidator} from './defineValidator';

export const validatePhysicalProperties = defineValidator(() => ({
  validate: (value: unknown): value is DeliveryOptionsPhysicalProperties | null => {
    if (value === null) return true;

    if (!isObject(value) || !('weight' in value) || !isObject(value.weight)) return false;

    const {weight} = value;

    return (
      'unit' in weight &&
      weight.unit === 'g' &&
      'value' in weight &&
      Number.isSafeInteger(weight.value) &&
      Number(weight.value) > 0
    );
  },
  error: 'Expected null or a positive integer weight in grams',
  parse: (value: DeliveryOptionsPhysicalProperties | null): DeliveryOptionsPhysicalProperties | null =>
    value === null ? null : {weight: {value: value.weight.value, unit: 'g'}},
}));
