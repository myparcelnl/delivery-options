import {beforeAll, describe, expect, it} from 'vitest';
import {CONFIG, formConfigDelivery, formConfigPickup, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {getLowestPriceFromFormConfig, getPriceLabelFromFormConfig} from '../../legacy/data';
import {mockConfigBus} from './mockConfigBus';

let beConfigBus;
let nlConfigBus;

describe.skip('price logic', () => {
  beforeAll(() => {
    beConfigBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 3.23,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 3.4,
            [CONFIG.PRICE_EVENING_DELIVERY]: 4.58,
            [CONFIG.PRICE_PICKUP]: -1,
          },
          [CarrierName.Dpd]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: -1,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 0,
            [CONFIG.PRICE_EVENING_DELIVERY]: 3.2,
            [CONFIG.PRICE_PICKUP]: -3,
          },
          [CarrierName.PostNl]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 5.4,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 3.59,
            [CONFIG.PRICE_EVENING_DELIVERY]: 3.2,
            [CONFIG.PRICE_PICKUP]: 0,
          },
        },
      },
    });

    nlConfigBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.MyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 5.4,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 3.59,
            [CONFIG.PRICE_EVENING_DELIVERY]: 3.2,
            [CONFIG.PRICE_PICKUP]: 0,
          },
        },
      },
    });
  });

  it('gets the correct lowest delivery price for a single carrier', () => {
    const priceBeBpost = getLowestPriceFromFormConfig(formConfigDelivery, CarrierName.Bpost, beConfigBus);
    const priceBeDpd = getLowestPriceFromFormConfig(formConfigDelivery, CarrierName.Dpd, beConfigBus);
    const priceBePostNl = getLowestPriceFromFormConfig(formConfigDelivery, CarrierName.PostNl, beConfigBus);
    const priceNlPostNl = getLowestPriceFromFormConfig(formConfigDelivery, CarrierName.PostNl, nlConfigBus);

    // Always returns the price of standard delivery for BE because morning and evening delivery are not allowed.
    expect(priceBeBpost).toEqual(3.4);
    expect(priceBeDpd).toEqual(0);
    expect(priceBePostNl).toEqual(3.59);

    // Evening delivery
    expect(priceNlPostNl).toEqual(3.2);
  });

  it('gets the correct lowest pickup price for a single carrier', () => {
    const priceBeBpost = getLowestPriceFromFormConfig(formConfigPickup, CarrierName.Bpost, beConfigBus);
    const priceBeDpd = getLowestPriceFromFormConfig(formConfigPickup, CarrierName.Dpd, beConfigBus);
    const priceBePostNl = getLowestPriceFromFormConfig(formConfigPickup, CarrierName.PostNl, beConfigBus);
    const priceNlPostNl = getLowestPriceFromFormConfig(formConfigPickup, CarrierName.PostNl, nlConfigBus);

    expect(priceBeBpost).toEqual(-1);
    expect(priceBeDpd).toEqual(-3);
    expect(priceBePostNl).toEqual(0);
    expect(priceNlPostNl).toEqual(0);
  });

  it('gets the correct lowest price for all carriers', () => {
    const priceBeDelivery = getLowestPriceFromFormConfig(formConfigDelivery, undefined, beConfigBus);

    // 0 (dpd standard delivery) because morning and evening are ignored for bpost and dpd.
    expect(priceBeDelivery).toEqual(0);
  });

  it('formats discounts correctly', () => {
    const discountLabel = getPriceLabelFromFormConfig(formConfigPickup, CarrierName.Bpost, beConfigBus);
    expect(discountLabel).toEqual('€ 1,00 korting');
  });

  it('formats minimum price correctly', () => {
    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, CarrierName.PostNl, beConfigBus);
    expect(priceLabel).toEqual('Vanaf € 3,59');
  });

  it('handles missing, null and undefined values', () => {
    const configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: undefined,
            [CONFIG.PRICE_STANDARD_DELIVERY]: null,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, undefined, configBus);
    expect(priceLabel).toEqual('Vanaf € 0,00');
  });

  it('handles show price surcharge setting properly', () => {
    const configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.SHOW_PRICE_SURCHARGE]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 5.1,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 0,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, undefined, configBus);
    expect(priceLabel).toEqual(null);
  });
});
