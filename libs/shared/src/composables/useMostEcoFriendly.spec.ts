import {describe, expect, it} from 'vitest';
import {useMostEcoFriendly} from '@myparcel/delivery-options/ts';

describe('useMostEcoFriendly', () => {
  it('should return true on the most eco friendly item in a group', () => {
    const berry1 = useMostEcoFriendly(1, 'berry');
    const berry2 = useMostEcoFriendly(2, 'berry');
    const berry3 = useMostEcoFriendly(3, 'berry');

    const grape1 = useMostEcoFriendly(1, 'grape');
    const grape2 = useMostEcoFriendly(2, 'grape');
    const grape3 = useMostEcoFriendly(3, 'grape');

    expect(berry1.value).toBe(false);
    expect(berry2.value).toBe(false);
    expect(berry3.value).toBe(true);

    expect(grape1.value).toBe(false);
    expect(grape2.value).toBe(false);
    expect(grape3.value).toBe(true);
  });

  it('should return true if there are no other items', () => {
    const chocolate1 = useMostEcoFriendly(1, 'chocolate');
    const cookie1 = useMostEcoFriendly(1, 'cookie');
    const candy1 = useMostEcoFriendly(1, 'candy');

    expect(chocolate1.value).toBe(true);
    expect(cookie1.value).toBe(true);
    expect(candy1.value).toBe(true);
  });
});
