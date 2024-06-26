import {describe, expect, it} from 'vitest';
import {type SupportedPlatformName} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getDefaultConfigForPlatform} from './getDefaultConfigForPlatform';

describe('getDefaultConfigForPlatform', () => {
  it.each([PlatformName.MyParcel, PlatformName.SendMyParcel] satisfies SupportedPlatformName[])(
    'should return the correct default config for platform %s',
    (platform) => {
      const config = getDefaultConfigForPlatform(platform);

      expect(config).toMatchSnapshot();
    },
  );
});
