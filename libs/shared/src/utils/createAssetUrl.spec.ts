import {describe, expect, it} from 'vitest';
import {createAssetUrl} from './createAssetUrl';

describe('createAssetUrl', () => {
  it('creates an asset url', () => {
    expect(createAssetUrl('foo')).toBe('https://assets.myparcel.nl/foo');
  });

  it('trims leading slashes', () => {
    expect(createAssetUrl('/foo')).toBe('https://assets.myparcel.nl/foo');
  });
});
