import {describe, it, expect} from 'vitest';
import {createTestConfiguration} from './createTestConfiguration';

describe('createTestConfiguration', () => {
  it('creates a default test configuration with unique prices for all options', () => {
    const result = createTestConfiguration();

    expect(result).toMatchSnapshot();
  });
});
