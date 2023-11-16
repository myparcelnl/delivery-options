import {describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

describe.skip('sandboxConfigBus', () => {
  it('is a renderless Vue instance', () => {
    expect(sandboxConfigBus._isVue).toBe(true);
    expect(sandboxConfigBus.render).toBeFalsy();
  });

  it('updates settings by path correctly', () => {
    const currencyPath = [PlatformName.SendMyParcel, KEY_CONFIG, CONFIG.CURRENCY].join('.');

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('EUR');

    sandboxConfigBus.update({
      name: currencyPath,
      value: 'JPY',
    });

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('JPY');
  });

  it('can switch platforms', () => {
    expect(sandboxConfigBus.platform).toBe(PlatformName.MyParcel);
    sandboxConfigBus.setPlatform(PlatformName.SendMyParcel);
    expect(sandboxConfigBus.platform).toBe(PlatformName.SendMyParcel);
  });
});
