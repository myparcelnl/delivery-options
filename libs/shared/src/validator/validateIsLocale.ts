import {isString} from 'radash';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

const isValidLocale = (value: string): boolean => {
  try {
    Intl.getCanonicalLocales(value);

    return true;
  } catch (error) {
    // Intl throws a RangeError for a malformed language tag.
    if (error instanceof RangeError) {
      return false;
    }

    throw error;
  }
};

/**
 * Validates that a value is a language tag that Intl accepts, such as "nl-NL" or "nl".
 */
export const validateIsLocale = defineValidator<unknown, string>(() => ({
  validate: (value): value is string => isString(value) && isValidLocale(value),
  error: createValueMustBe('a valid locale'),
}));
