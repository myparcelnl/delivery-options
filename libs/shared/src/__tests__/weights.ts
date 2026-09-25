/**
 * Shipment weights in grams for tests. WEIGHT_MAX is the pickup limit that the capabilities API
 * returned for DPD on acceptance: pickup is available up to and including 20 kg.
 */
export const WEIGHT_MIN = 1;

export const WEIGHT_MAX = 20000;

export const WEIGHT_TOO_HEAVY = WEIGHT_MAX + 1;

export const WEIGHT_UNDERWEIGHT = 15000;
