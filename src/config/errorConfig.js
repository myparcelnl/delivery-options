/* eslint no-multi-spaces: ["warn", { exceptions: { "VariableDeclarator": true } }] */

export const ERROR_NO_ADDRESS            = 3212;
export const ERROR_NO_CC                 = 3224;
export const ADDRESS_ERROR               = 3505;
export const ERROR_COUNTRY_NOT_SUPPORTED = 3506;
export const ERROR_INVALID_CARRIER       = 3728;

/**
 * Errors that should trigger a "fatal" error, which will hide the delivery options.
 *
 * @type {Number[]}
 */
export const FATAL_ERRORS = [
  ERROR_COUNTRY_NOT_SUPPORTED,
];
