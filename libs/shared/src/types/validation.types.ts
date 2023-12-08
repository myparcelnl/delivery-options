// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomValidator<T1 = any, T2 = T1> {
  error: string;

  /**
   * Parse the input value after validation.
   */
  parse?(value: T1): T2;

  /**
   * Parse the input value before validation.
   */
  preParse?(value: T1): T2;

  /**
   * Validate the input value.
   */
  validate(value: T1): boolean;
}
