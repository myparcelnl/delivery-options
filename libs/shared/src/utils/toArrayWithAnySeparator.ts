import {toArray} from '@myparcel/ts-utils';

const SEPARATORS = [',', ';', ' '] as const;

export const toArrayWithAnySeparator = (itemOrItems: string): string[] => {
  for (const separator of SEPARATORS) {
    const array = toArray(itemOrItems, separator);

    if (array.length > 1) {
      return array;
    }
  }

  return toArray(itemOrItems);
};
