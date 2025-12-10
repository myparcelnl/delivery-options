import {describe, it, expect} from 'vitest';
import {defineField, defineForm, type InteractiveElementInstance} from '@myparcel-dev/vue-form-builder';
import {generateFieldId} from './generateFieldId';

describe('generateFieldId', () => {
  it('generates a field id', () => {
    const element = {
      name: 'test',
      form: {
        name: 'form',
      },
    } as unknown as InteractiveElementInstance;

    expect(generateFieldId(element)).toBe('form--test');
  });
});
