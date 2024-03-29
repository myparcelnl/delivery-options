import {describe, it, expect} from 'vitest';
import {createAssetUrl} from './createAssetUrl';

describe('createAssetUrl', () => {
  it('creates an asset url', () => {
    // In test environment, the base path is "/"
    expect(createAssetUrl('translations/en.json')).toBe('/translations/en.json');
  });
});
