// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomValidator<InputType = any, TargetType = InputType> {
  error: string;

  /**
   * Parse the input value after validation.
   */
  parse?(value: InputType): TargetType;

  /**
   * Parse the input value before validation.
   */
  preParse?(value: InputType): TargetType;

  /**
   * Validate the input value.
   */
  validate(value: InputType | TargetType): value is TargetType;
}
