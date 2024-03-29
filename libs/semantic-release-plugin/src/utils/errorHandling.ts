import AggregateError from 'aggregate-error';

const errors: Error[] = [];

export const addError = (error: Error): void => {
  errors.push(error);
};

export const hasErrors = (): boolean => errors.length > 0;

export const throwIfHasErrors = (): void => {
  if (hasErrors()) {
    throw new AggregateError(errors);
  }
};
