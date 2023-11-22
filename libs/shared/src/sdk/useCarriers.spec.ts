import {describe, expect, it} from 'vitest';
import {get} from '@vueuse/core';
import {GetCarrier} from '@myparcel/sdk';
import {fakeCarriersResponse} from '../__tests__/mocks/fakeCarriersResponse';
import {useRequestClient} from './useRequestClient';
import {useCarriers} from './useCarriers';

describe('useCarriers', () => {
  const amountOfCarriers = fakeCarriersResponse().length;

  it('fetches carriers', async () => {
    expect.assertions(1 + amountOfCarriers * 5);

    const query = useCarriers();
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

    const query = useCarriers();
    await query.load();
    const carriers = get(query.data);

    const queryClient = useRequestClient();

    expect(carriers).toHaveLength(amountOfCarriers);

    carriers?.forEach((carrier) => {
      expect(queryClient.get([GetCarrier.name, carrier.name])).toBe(carrier);
    });
  });
});
