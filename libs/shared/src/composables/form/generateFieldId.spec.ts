import {describe, it, expect} from 'vitest';
import {type ElementInstance} from '../../types';
import {generateFieldId} from './generateFieldId';

describe('generateFieldId', () => {
  it('generates a field id', () => {
    const mockElement = {
      name: 'test',
      form: {name: 'form'},
    } as unknown as ElementInstance;

    expect(generateFieldId(mockElement)).toBe('form--test');
  });

  it('handles form names with dashes', () => {
    const mockElement = {
      name: 'field',
      form: {name: 'my-form--nested'},
    } as unknown as ElementInstance;

    expect(generateFieldId(mockElement)).toBe('my-form--field');
  });
});
