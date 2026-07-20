import {describe, it, expect} from 'vitest';
import {CarrierSetting, OptionType} from '../data';
import {getAllConfigOptions} from './getAllConfigOptions';

describe('getAllConfigOptions', () => {
  it('declares the same day cutoff time option', () => {
    const option = getAllConfigOptions().find((item) => item.key === CarrierSetting.CutoffTimeSameDay);

    expect(option).toBeDefined();
    expect(option?.type).toBe(OptionType.Time);
  });
});
