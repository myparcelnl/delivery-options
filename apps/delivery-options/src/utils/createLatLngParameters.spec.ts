import {describe, it, expect} from 'vitest';
import {createLatLngParameters} from './createLatLngParameters';

describe('createLatLngParameters', () => {
  it('returns undefined when no latLng is provided', () => {
    expect(createLatLngParameters()).toBeUndefined();
  });

  it('returns undefined when latitude is missing', () => {
    expect(createLatLngParameters([undefined, 4.9] as any)).toBeUndefined();
  });

  it('returns undefined when longitude is missing', () => {
    expect(createLatLngParameters([52.378, undefined] as any)).toBeUndefined();
  });

  it('returns latitude and longitude as strings when both are provided', () => {
    const result = createLatLngParameters([52.378, 4.9]);

    expect(result).toEqual({
      latitude: '52.378',
      longitude: '4.9',
    });
  });

  it('converts numeric values to strings', () => {
    const result = createLatLngParameters([52, 5]);

    expect(result).toEqual({
      latitude: '52',
      longitude: '5',
    });
  });
});
