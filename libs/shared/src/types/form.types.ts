import {type InteractiveElementInstance} from '@myparcel/vue-form-builder';

export interface ElementProps<T> {
  element: InteractiveElementInstance;
  modelValue: T;
}

export interface ElementEmits<T> {
  'update:modelValue': (value: T) => void;
}
