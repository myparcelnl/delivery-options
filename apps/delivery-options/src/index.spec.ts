import * as index from './index';
import {describe, expect, it} from 'vitest';

describe('exports', () => {
  it('exports from index.ts', () => {
    expect(Object.keys(index).sort()).toMatchSnapshot();
  });
});
