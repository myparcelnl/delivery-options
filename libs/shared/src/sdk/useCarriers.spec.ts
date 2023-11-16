import {describe, expect, it} from 'vitest';
import {useCarriers} from './useCarriers';

describe('useCarriers', () => {
  it('fetches carriers', async () => {
    const query = useCarriers();

    await query.suspense();

    expect(query.data.value).toBe(expect.any(Array));
  });
});
