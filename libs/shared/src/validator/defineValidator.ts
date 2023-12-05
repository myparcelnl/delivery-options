import {type CustomValidator} from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorFunction<T1, T2 = T1> = (...args: any[]) => CustomValidator<T1, T2>;

export const defineValidator = <T1, T2 = T1, T extends ValidatorFunction<T1, T2> = ValidatorFunction<T1, T2>>(
  validator: T,
): T => validator;
