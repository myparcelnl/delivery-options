import {describe, it, expect} from 'vitest';
import {CarrierSetting} from '@myparcel-dev/do-shared';
import {getAllSandboxConfigOptions, type SandboxConfigOption} from './getAllSandboxConfigOptions';

describe('getAllSandboxConfigOptions', () => {
  it('nests the same day cutoff time under the same day toggle', () => {
    const option: SandboxConfigOption | undefined = getAllSandboxConfigOptions().find(
      (item) => item.key === CarrierSetting.CutoffTimeSameDay,
    );

    expect(option).toBeDefined();
    expect(option?.parents).toEqual([CarrierSetting.AllowSameDayDelivery]);
  });
});
