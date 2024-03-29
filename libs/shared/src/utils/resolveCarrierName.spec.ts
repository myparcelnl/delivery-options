import {describe, expect, it} from 'vitest';
import {CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from '../types';
import {resolveCarrierName} from './resolveCarrierName';

describe('resolveCarrierName', () => {
  it.each([
    [CarrierName.PostNl, CarrierName.PostNl],
    [`${CarrierName.DhlForYou}:12456`, CarrierName.DhlForYou],
  ] satisfies [CarrierIdentifier, CarrierName][])('should resolve carrier name %s => %s', (input, expected) => {
    expect(resolveCarrierName(input)).toBe(expected);
  });
});
