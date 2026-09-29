import {describe, expect, it} from 'vitest';
import {WEIGHT_MIN, WEIGHT_TOO_HEAVY} from '@myparcel-dev/do-shared/testing';
import {type DeliveryOptionsPhysicalProperties} from '../types';
import {validatePhysicalProperties} from './validatePhysicalProperties';

describe('validatePhysicalProperties', () => {
  it.each([
    [null, true],
    [{weight: WEIGHT_MIN}, true],
    [{weight: WEIGHT_TOO_HEAVY}, true],
    [undefined, false],
    [{}, false],
    [[], false],
    [WEIGHT_MIN, false],
    [{weight: 0}, false],
    [{weight: -WEIGHT_MIN}, false],
    [{weight: 1.5}, false],
    [{weight: NaN}, false],
    [{weight: String(WEIGHT_MIN)}, false],
    [{weight: null}, false],
    [{weight: {value: WEIGHT_MIN, unit: 'g'}}, false],
  ])('should validate %s as %s', (value, expected) => {
    expect(validatePhysicalProperties().validate(value)).toEqual(expected);
  });

  it('should keep only the weight when it parses a valid value', () => {
    const value = {weight: WEIGHT_MIN, height: 10} as DeliveryOptionsPhysicalProperties;

    expect(validatePhysicalProperties().parse?.(value)).toEqual({weight: WEIGHT_MIN});
  });

  it('should parse null as null', () => {
    expect(validatePhysicalProperties().parse?.(null)).toBeNull();
  });
});
