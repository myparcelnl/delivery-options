import {describe, expect, it, vi} from 'vitest';
import {useVModel} from '@vueuse/core';
import {type SelectOption} from '../../types';
import {calculateInitialValue} from './calculateInitialValue';

describe('calculateInitialValue', () => {
  it('should return null if no options are available', () => {
    const model = useVModel({modelValue: 'foo'}, undefined, vi.fn);
    const options: SelectOption<string>[] = [];

    const result = calculateInitialValue(model, options);

    expect(result).toBe(null);
  });

  describe('single', () => {
    it('should return null if the model already has a value that is present in options', () => {
      const model = useVModel({modelValue: 'foo'}, undefined, vi.fn);
      const options: SelectOption<string>[] = [{value: 'foo', label: 'foo'}];

      const result = calculateInitialValue(model, options);

      expect(result).toBe(null);
    });

    it.each([
      ['model has no value', undefined],
      ['model has a value that is not present in options', 'bar'],
    ])('should return the first option if %s', (_, modelValue) => {
      const model = useVModel({modelValue: modelValue as string}, undefined, vi.fn);
      const options: SelectOption<string>[] = [
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
      const options: SelectOption<string>[] = [
        {value: 'beer', label: 'beer'},
        {value: 'koe', label: 'koe', selected: true, disabled: true},
        {value: 'lama', label: 'lama', selected: true},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toEqual(['koe', 'lama']);
    });

    it('should return null if model already contains a value that is present in options', () => {
      const model = useVModel({modelValue: ['koe']}, undefined, vi.fn);
      const options: SelectOption<string>[] = [
        {value: 'beer', label: 'beer'},
        {value: 'koe', label: 'koe', selected: true, disabled: true},
        {value: 'lama', label: 'lama', selected: true},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toEqual(['koe']);
    });

    it('should set disabled options to the correct value', () => {
      const model = useVModel({modelValue: ['beer', 'koe', 'lama']}, undefined, vi.fn);
      const options: SelectOption<string>[] = [
        {value: 'beer', label: 'beer'},
        {value: 'koe', label: 'koe', selected: true, disabled: true},
        {value: 'lama', label: 'lama', disabled: true},
        {value: 'poes', label: 'poes', selected: true, disabled: true},
      ];

      const result = calculateInitialValue(model, options);

      expect(result).toEqual(['beer', 'koe', 'poes']);
    });
  });
});
