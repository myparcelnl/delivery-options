const TIMESTAMP_PAD_LENGTH = 2;

export const padTime = (input: string | number, length = TIMESTAMP_PAD_LENGTH): string => {
  return input.toString().padStart(length, '0');
};
