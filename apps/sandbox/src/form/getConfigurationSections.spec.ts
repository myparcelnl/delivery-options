import {describe, expect, it} from 'vitest';
import {getConfigurationSections} from './getConfigurationSections';

describe('getConfigurationSections', () => {
  it('gets sandbox option groups', () => {
    const sections = getConfigurationSections();

    expect(sections).toMatchSnapshot();
  });
});
