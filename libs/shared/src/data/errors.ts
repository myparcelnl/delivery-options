export const ERROR_MISSING_REQUIRED_PARAMETER = 3212;

export const ERROR_INVALID_CUTOFF_TIME_PROVIDED = 3214;

export const ERROR_INVALID_QUERY_PARAMETER = 3224;

export const ERROR_ADDRESS_UNKNOWN = 3501;

export const ERROR_INVALID_POSTAL_CODE = 3505;

export const ERROR_INVALID_COUNTRY_CODE = 3506;

export const ERROR_COUNTRY_NOT_SUPPORTED_BY_CARRIER = 3516;

export const ERROR_DELIVERY_OPTIONS_WRONG_COUNTRY = 3517;

export const ERROR_NO_DELIVERY_OPTIONS_FOUND = 3721;

export const ERROR_UNSUPPORTED_CARRIER = 3728;

export const ERROR_ADDRESS_CAN_NOT_BE_SPLIT = 3731;

export const ERROR_WADDEN_ISLANDS = 3753;

/**
 * Currently occurs when requesting dpd on myparcelnl.
 * @TODO remove this from the ignored errors when dpd delivery options are supported on myparcelnl.
 */
export const ERROR_INVALID_CARRIER_PLATFORM_COMBINATION = 10832;

export const IGNORED_ERRORS = Object.freeze([
  0,
  ERROR_INVALID_COUNTRY_CODE,
  ERROR_INVALID_CARRIER_PLATFORM_COMBINATION,
]);

export const ERROR_REPLACE_MAP: Record<number, number> = Object.freeze({
  [ERROR_ADDRESS_CAN_NOT_BE_SPLIT]: ERROR_ADDRESS_UNKNOWN,
});
