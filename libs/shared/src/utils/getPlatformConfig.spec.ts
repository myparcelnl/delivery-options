import {describe, expect, it} from 'vitest';
import {type SupportedPlatformName} from '../types';
import {SUPPORTED_PLATFORMS} from '../data/constants';
import {getPlatformConfig} from './getPlatformConfig';

describe('getPlatformConfig', () => {
  it.each(SUPPORTED_PLATFORMS)('gets config for platform %s', (platform) => {
    const config = getPlatformConfig(platform);

    expect(config).toMatchSnapshot();
  });

  it('throws error when no configuration is found', () => {
    expect(() => {
      return getPlatformConfig('foo' as SupportedPlatformName);
    }).toThrowError();
  });
});
