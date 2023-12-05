import {describe, expect, it} from 'vitest';
import {getConfigSandboxSections} from './getConfigSandboxSections';

describe('getConfigurationSections', () => {
  it('gets sandbox option groups', () => {
    const sections = getConfigSandboxSections();

    expect(sections).toMatchSnapshot();
  });
});
