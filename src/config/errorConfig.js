/* eslint no-multi-spaces: ["warn", { exceptions: { "VariableDeclarator": true } }] */

export const ERROR_MISSING_REQUIRED_PARAMETER   = 3212;
export const ERROR_INVALID_CUTOFF_TIME_PROVIDED = 3214;
export const ERROR_INVALID_QUERY_PARAMETER      = 3224;
export const ERROR_ADDRESS_UNKNOWN              = 3501;
export const ERROR_INVALID_POSTAL_CODE          = 3505;
export const ERROR_INVALID_COUNTRY_CODE         = 3506;
export const ERROR_UNSUPPORTED_CARRIER          = 3728;
export const ERROR_WADDEN_ISLANDS               = 3753;

/**
 * Errors that should trigger a "fatal" error, which will hide the delivery options.
 *
 * @type {number[]}
 */
export const FATAL_ERRORS = [
  ERROR_INVALID_COUNTRY_CODE,
];
