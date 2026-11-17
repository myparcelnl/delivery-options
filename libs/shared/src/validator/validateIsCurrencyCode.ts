import {isString} from 'radash';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

/**
 * Validates that a value is an ISO 4217 currency code the browser knows, in any letter case.
 */
export const validateIsCurrencyCode = defineValidator<unknown, string>(() => ({
  validate: (value): value is string =>
    isString(value) &&
    // A browser without Intl.supportedValuesOf cannot check that the currency exists, so reject it and keep the default.
    typeof Intl.supportedValuesOf === 'function' &&
    Intl.supportedValuesOf('currency').includes(value.toUpperCase()),
  parse: (value) => String(value).toUpperCase(),
  error: createValueMustBe('a valid currency code'),
}));
