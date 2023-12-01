import {type CustomValidator} from '../types';

export const valueValidator = <T extends string>(values: T[]): CustomValidator<T> => {
  return {
    validate: (_, value) => values.includes(value),
    errorMessage: `Value must be one of ${values.join(', ')}`,
  };
};
