import {describe, expect, it} from 'vitest';
import {get} from '@vueuse/core';
import {type Carrier} from '@myparcel/sdk';
import {REQUEST_KEY_CARRIERS} from '../data';
import {useRequestClient} from './useRequestClient';
import {useCarriersRequest} from './useCarriersRequest';

describe('useCarriersRequest', () => {
  const amountOfCarriers = Number(fakeCarriersResponse().length);

  it('fetches carriers', async () => {
    expect.assertions(1 + amountOfCarriers * 5);

    const query = useCarriersRequest();
    await query.load();
    const result = get(query.data);

    expect(result).toHaveLength(amountOfCarriers);

    result?.forEach((carrier) => {
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

    const carriers = get(query.data) as Carrier[];

    const requestClient = useRequestClient();

    expect(carriers).toHaveLength(amountOfCarriers);

    carriers.forEach((carrier) => {
      expect(requestClient.values.get([REQUEST_KEY_CARRIERS, carrier.name])).toBe(carrier);
    });
  });
});
