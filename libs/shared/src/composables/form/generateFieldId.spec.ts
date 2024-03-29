import {describe, it, expect} from 'vitest';
import {defineField, defineForm, type InteractiveElementInstance} from '@myparcel/vue-form-builder';
import {generateFieldId} from './generateFieldId';

describe('generateFieldId', () => {
  it('generates a field id', () => {
    const element = defineField({
      name: 'test',
      component: 'input',
    });

    const form = defineForm('form', {fields: [element]});
    const field = form.getField<InteractiveElementInstance>('test');

    expect(generateFieldId(field)).toBe('form--test');
  });
});
