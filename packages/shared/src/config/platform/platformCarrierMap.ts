import {CARRIERS, CarrierName, PlatformName} from '@myparcel/sdk';

/**
 * Maps platforms to their available carriers.
 */
export const platformCarrierMap: Record<PlatformName, CarrierName[]> = {
  myparcel: [
    CARRIERS.DHL_NAME,
    CARRIERS.INSTABOX_NAME,
    CARRIERS.POST_NL_NAME,
  ],
  belgie: [
    CARRIERS.BPOST_NAME,
    CARRIERS.DPD_NAME,
    CARRIERS.POST_NL_NAME,
  ],
  flespakket: [
    CARRIERS.POST_NL_NAME,
  ],
};
