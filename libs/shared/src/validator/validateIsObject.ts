import {isObject} from 'radash';
import {createValueMustBeA, TYPE_OBJECT} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsObject = defineValidator(() => {
  return {
    validate: isObject,
    error: createValueMustBeA(`n ${TYPE_OBJECT}`),
  };
});
