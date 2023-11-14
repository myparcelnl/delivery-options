import {describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG, MYPARCEL, SENDMYPARCEL} from '@myparcel-do/shared';

describe('sandboxConfigBus', () => {
  it('is a renderless Vue instance', () => {
    expect(sandboxConfigBus._isVue).toBe(true);
    expect(sandboxConfigBus.render).toBeFalsy();
  });

  it('updates settings by path correctly', () => {
    const currencyPath = [SENDMYPARCEL, KEY_CONFIG, CONFIG.CURRENCY].join('.');

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('EUR');

    sandboxConfigBus.update({
      name: currencyPath,
      value: 'JPY',
    });

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('JPY');
  });

  it('can switch platforms', () => {
    expect(sandboxConfigBus.platform).toBe(MYPARCEL);
    sandboxConfigBus.setPlatform(SENDMYPARCEL);
    expect(sandboxConfigBus.platform).toBe(SENDMYPARCEL);
  });
});
