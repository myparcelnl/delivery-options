import {describe, expect, it, vi} from 'vitest';
import {useVModel} from '@vueuse/core';
import {calculateInitialValue, type SelectOption} from '@myparcel-do/shared';

describe('calculateInitialValue', () => {
  it('should return undefined if no options are available', () => {
    const model = useVModel({modelValue: 'foo'}, undefined, vi.fn);
    const options: SelectOption[] = [];

    const result = calculateInitialValue(model, options);

    expect(result).toBe(undefined);
  });

  describe('single', () => {
    it('should return undefined if the model already has a value that is present in options', () => {
      const model = useVModel({modelValue: 'foo'}, undefined, vi.fn);
      const options: SelectOption[] = [{value: 'foo', label: 'foo'}];

      const result = calculateInitialValue(model, options);

      expect(result).toBe(undefined);
    });

    it.each([
      ['model has no value', undefined],
      ['model has a value that is not present in options', 'bar'],
    ])('should return the first option if %s', (_, modelValue) => {
      const model = useVModel({modelValue}, undefined, vi.fn);
      const options: SelectOption[] = [
        {value: 'beer', label: 'beer'},
        {value: 'lama', label: 'lama'},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toBe('beer');
    });
  });

  describe('multiple', () => {
    it.each([
      ['is empty array', []],
      ['already contains a value that is not present in options', ['bar']],
    ])('should return the selected options if model %s', (_, modelValue) => {
      const model = useVModel({modelValue}, undefined, vi.fn);
      const options: SelectOption[] = [
        {value: 'beer', label: 'beer'},
        {value: 'koe', label: 'koe', selected: true, disabled: true},
        {value: 'lama', label: 'lama', selected: true},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toEqual(['koe', 'lama']);
    });

    it('should return undefined if model already contains a value that is present in options', () => {
      const model = useVModel({modelValue: ['koe']}, undefined, vi.fn);
      const options: SelectOption[] = [
        {value: 'beer', label: 'beer'},
        {value: 'koe', label: 'koe', selected: true, disabled: true},
        {value: 'lama', label: 'lama', selected: true},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toEqual(undefined);
    });
  });
});
