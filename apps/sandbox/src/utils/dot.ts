export const dot = (input: Record<string, unknown>): Record<string, string> => {
  const result: Record<string, unknown> = {};

  const recurse = (obj: Record<string, unknown>, current?: string) => {
    for (const key in obj) {
      const value = obj[key];
      const newKey = current ? `${current}.${key}` : key;

      if (value && typeof value === 'object') {
        recurse(value as Record<string, unknown>, newKey);
      } else {
        result[newKey] = value;
      }
    }
  };

  recurse(input);

  return result as Record<string, string>;
};
