export const padStart = (input: string | number, length: number): string => {
  return input.toString().padStart(length, '0');
};
