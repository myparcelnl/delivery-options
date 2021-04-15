import * as CARRIERS from '@/data/keys/carrierKeys';
import * as LOCALE from '@/config/localeConfig';
import * as PLATFORMS from '@/data/keys/platformKeys';
import * as countryCodes from '@/data/keys/countryCodes';

/**
 * @type {MyParcel.Platform[]}
 */
export const platforms = [
  PLATFORMS.MYPARCEL,
  PLATFORMS.SENDMYPARCEL,
];

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    CARRIERS.RED_JE_PAKKETJE,
    CARRIERS.DHL,
  ],
  [PLATFORMS.SENDMYPARCEL]: [
    CARRIERS.BPOST,
    CARRIERS.DPD,
    CARRIERS.POSTNL,
  ],
};

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
const platformLocaleMap = {
  [PLATFORMS.MYPARCEL]: countryCodes.CC_NL,
  [PLATFORMS.SENDMYPARCEL]: countryCodes.CC_BE,
};

/**
 * Map platform names to their respective URLs.
 */
export const platformUrlMap = {
  [PLATFORMS.MYPARCEL]: 'myparcel.nl',
  [PLATFORMS.SENDMYPARCEL]: 'sendmyparcel.be',
};

/**
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const platformConfig = (platform) => {
  return LOCALE.CONFIG_MAP[platformLocaleMap[platform]];
};

export const platformTabs = [
  {
    name: PLATFORMS.MYPARCEL,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.myparcel.nl',
      },
      {
        text: 'links.website',
        href: 'https://myparcel.nl',
      },
    ],
  },
  {
    name: PLATFORMS.SENDMYPARCEL,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.sendmyparcel.be',
      },
      {
        text: 'links.website',
        href: 'https://sendmyparcel.be',
      },
    ],
  },
];
