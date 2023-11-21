import {type CustomValidator, type Keyable} from '../types';

export const valueValidator = <T extends Keyable>(values: T[]): CustomValidator<T> => {
  return {
    validate: (_, value) => values.includes(value),
    errorMessage: `Value must be one of ${values.join(', ')}`,
  };
};
