import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { formConfigDelivery, formConfigPickup } from '@/config/formConfig';
import { getLowestPriceFromFormConfig } from '@/delivery-options/data/prices/getLowestPriceFromFormConfig';
import { getPriceLabelFromFormConfig } from '@/delivery-options/data/prices/getPriceLabelFromFormConfig';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';

describe('price logic', () => {
  const beConfigBus = mockConfigBus({
    [CONFIG.KEY]: {
      [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
      [CONFIG.CARRIER_SETTINGS]: {
        [CARRIERS.BPOST]: {
          [CONFIG.PRICE_MORNING_DELIVERY]: 3.23,
          [CONFIG.PRICE_STANDARD_DELIVERY]: 3.40,
          [CONFIG.PRICE_EVENING_DELIVERY]: 4.58,
          [CONFIG.PRICE_PICKUP]: -1,
        },
        [CARRIERS.DPD]: {
          [CONFIG.PRICE_MORNING_DELIVERY]: -1,
          [CONFIG.PRICE_STANDARD_DELIVERY]: 0,
          [CONFIG.PRICE_EVENING_DELIVERY]: 3.20,
          [CONFIG.PRICE_PICKUP]: -3,
        },
        [CARRIERS.POSTNL]: {
          [CONFIG.PRICE_MORNING_DELIVERY]: 5.40,
          [CONFIG.PRICE_STANDARD_DELIVERY]: 3.59,
          [CONFIG.PRICE_EVENING_DELIVERY]: 3.20,
          [CONFIG.PRICE_PICKUP]: 0,
        },
      },
    },
  });

  const nlConfigBus = mockConfigBus({
    [CONFIG.KEY]: {
      [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
      [CONFIG.CARRIER_SETTINGS]: {
        [CARRIERS.POSTNL]: {
          [CONFIG.PRICE_MORNING_DELIVERY]: 5.40,
          [CONFIG.PRICE_STANDARD_DELIVERY]: 3.59,
          [CONFIG.PRICE_EVENING_DELIVERY]: 3.20,
          [CONFIG.PRICE_PICKUP]: 0,
        },
      },
    },
  });

  it('gets the correct lowest delivery price for a single carrier', () => {
    const priceBeBpost = getLowestPriceFromFormConfig(formConfigDelivery, CARRIERS.BPOST, beConfigBus);
    const priceBeDpd = getLowestPriceFromFormConfig(formConfigDelivery, CARRIERS.DPD, beConfigBus);
    const priceBePostNl = getLowestPriceFromFormConfig(formConfigDelivery, CARRIERS.POSTNL, beConfigBus);
    const priceNlPostNl = getLowestPriceFromFormConfig(formConfigDelivery, CARRIERS.POSTNL, nlConfigBus);

    // Always returns the price of standard delivery for BE because morning and evening delivery are not allowed.
    expect(priceBeBpost).toEqual(3.4);
    expect(priceBeDpd).toEqual(0);
    expect(priceBePostNl).toEqual(3.59);

    // Evening delivery
    expect(priceNlPostNl).toEqual(3.2);
  });

  it('gets the correct lowest pickup price for a single carrier', () => {
    const priceBeBpost = getLowestPriceFromFormConfig(formConfigPickup, CARRIERS.BPOST, beConfigBus);
    const priceBeDpd = getLowestPriceFromFormConfig(formConfigPickup, CARRIERS.DPD, beConfigBus);
    const priceBePostNl = getLowestPriceFromFormConfig(formConfigPickup, CARRIERS.POSTNL, beConfigBus);
    const priceNlPostNl = getLowestPriceFromFormConfig(formConfigPickup, CARRIERS.POSTNL, nlConfigBus);

    expect(priceBeBpost).toEqual(-1);
    expect(priceBeDpd).toEqual(-3);
    expect(priceBePostNl).toEqual(0);
    expect(priceNlPostNl).toEqual(0);
  });

  it('gets the correct lowest price for all carriers', () => {
    const priceBeDelivery = getLowestPriceFromFormConfig(formConfigDelivery, null, beConfigBus);

    // 0 (dpd standard delivery) because morning and evening are ignored for bpost and dpd.
    expect(priceBeDelivery).toEqual(0);
  });

  it('formats discounts correctly', () => {
    const discountLabel = getPriceLabelFromFormConfig(formConfigPickup, CARRIERS.BPOST, beConfigBus);
    expect(discountLabel).toEqual('€ 1,00 korting');
  });

  it('formats minimum price correctly', () => {
    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, CARRIERS.POSTNL, beConfigBus);
    expect(priceLabel).toEqual('Vanaf € 3,59');
  });

  it('handles missing, null and undefined values', () => {
    const configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.BPOST]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: undefined,
            [CONFIG.PRICE_STANDARD_DELIVERY]: null,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, null, configBus);
    expect(priceLabel).toEqual('Vanaf € 0,00');
  });

  it('handles show price surcharge setting properly', () => {
    const configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
        [CONFIG.SHOW_PRICE_SURCHARGE]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.BPOST]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 5.10,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 0,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, null, configBus);
    expect(priceLabel).toEqual(null);
  });
});
