import {toValue} from 'vue';
import {describe, expect, it} from 'vitest';
import {type Carrier} from '@myparcel/sdk';
import {CarrierName} from '@myparcel/constants';
import {useCarrierFromCache} from './useCarrierFromCache';

describe('useCarrierFromCache', () => {
  it.each(Array.from(Object.values(CarrierName)))('fetches carrier %s from cache', async (carrierName: CarrierName) => {
    expect.assertions(7);
    const query = useCarrierFromCache(carrierName);

    await query.load();

    const carrier = toValue(query.data) as Carrier | undefined;

    expect(carrier).toBeInstanceOf(Object);
    expect(carrier?.name).toBe(carrierName);
    expect(carrier?.id).toBeTypeOf('number');
    expect(carrier?.name).toBeTypeOf('string');
    expect(carrier?.human).toBeTypeOf('string');
    expect(carrier?.meta).toHaveProperty('logo_svg');
    expect(carrier?.meta).toHaveProperty('logo_png');
  });
});
