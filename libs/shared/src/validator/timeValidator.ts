import {type CustomValidator} from '../types';

export const timeValidator = (): CustomValidator<string> => {
  return {
    validate: (_, value) => typeof value === 'string' && /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.exec(value) !== null,
    errorMessage: 'Value must be a time in the format HH:mm',
  };
};
