export const createFilenameFormatter = (name: string) => {
  return (format: string): string => {
    if (format === 'umd') {
      return `${name}.js`;
    }

    if (format === 'es') {
      format += 'm';
    }

    return `${name}.${format}.js`;
  };
};
