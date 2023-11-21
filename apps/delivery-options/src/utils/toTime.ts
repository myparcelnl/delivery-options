export const toTime = (date: Date | string): string => {
  if (date instanceof Date) {
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  return date.substring(11, 16);
};
