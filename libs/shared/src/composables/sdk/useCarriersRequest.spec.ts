import {toValue} from 'vue';
import {describe, expect, it} from 'vitest';
import {type Carrier} from '@myparcel-dev/sdk';
import {REQUEST_KEY_CARRIERS} from '../../data';
import {fakeCarriersResponse} from '../../__tests__';
import {useRequestStorage} from './useRequestStorage';
import {useCarriersRequest} from './useCarriersRequest';

describe('useCarriersRequest', () => {
  const amountOfCarriers = Number(fakeCarriersResponse().length);

  it('fetches carriers', async () => {
    expect.assertions(1 + amountOfCarriers * 5);

    const query = useCarriersRequest();
    await query.load();
    const result = toValue(query.data);

    expect(result).toHaveLength(amountOfCarriers);

    result?.forEach((carrier) => {
      if (typeof carrier.id !== 'number') {
        console.error('INVALID CARRIER:', JSON.stringify(carrier, null, 2));
      }
      expect(carrier.id).toBeTypeOf('number');
      expect(carrier.name).toBeTypeOf('string');
      expect(carrier.human).toBeTypeOf('string');
      expect(carrier.meta).toHaveProperty('logo_svg');
      expect(carrier.meta).toHaveProperty('logo_png');
    });
  });

  it('updates every single carrier query when all carriers are fetched', async () => {
    expect.assertions(1 + amountOfCarriers);

    const query = useCarriersRequest();
    await query.load();

    const carriers = toValue(query.data) as Carrier[];

    const requestClient = useRequestStorage();

    expect(carriers).toHaveLength(amountOfCarriers);

    carriers.forEach((carrier) => {
      expect(requestClient.get([REQUEST_KEY_CARRIERS, carrier.name])).toBe(carrier);
    });
  });
});
