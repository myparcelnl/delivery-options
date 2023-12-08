import {type CustomValidator} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorFunction<InputType, TargetType = InputType> = (...args: any[]) => CustomValidator<InputType, TargetType>;

export const defineValidator = <
  InputType,
  TargetType = InputType,
  T extends ValidatorFunction<InputType, TargetType> = ValidatorFunction<InputType, TargetType>,
>(
  validator: T,
): T => validator;
