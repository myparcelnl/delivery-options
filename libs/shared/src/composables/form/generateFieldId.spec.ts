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

  it('returns empty string when element is undefined', () => {
    expect(generateFieldId(undefined)).toBe('');
  });

  it('handles form name with dashes correctly', () => {
    const element = {
      name: 'field',
      form: {
        name: 'my-form--suffix',
      },
    } as unknown as InteractiveElementInstance;

    expect(generateFieldId(element)).toBe('my-form--field');
  });

  it('uses "form" as default when form name is missing', () => {
    const element = {
      name: 'test',
      form: undefined,
    } as unknown as InteractiveElementInstance;

    expect(generateFieldId(element)).toBe('form--test');
  });
});
