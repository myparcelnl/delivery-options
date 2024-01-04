import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {getConfigSandboxSections} from './getConfigSandboxSections';

describe('getConfigurationSections', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('gets sandbox option groups', () => {
    const sections = getConfigSandboxSections();

    expect(sections).toMatchSnapshot();
  });
});
