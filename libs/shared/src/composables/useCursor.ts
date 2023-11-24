import {type MaybeRef, type Ref, ref} from 'vue';
import {get} from '@vueuse/core';

interface UseCursorOptions {
  items: MaybeRef<unknown[]>;
}

interface UseCursor {
  cursor: Ref<number>;

  next(): void;

  previous(): void;

  reset(): void;
}

const CURSOR_NONE = -1;
export const useCursor = ({items}: UseCursorOptions): UseCursor => {
  const cursor = ref<number>(CURSOR_NONE);

  const previous = () => {
    if (cursor.value === CURSOR_NONE) {
      cursor.value = get(items).length;
    }

    cursor.value = (cursor.value - 1 + get(items).length) % get(items).length;
  };

  const next = () => {
    cursor.value = (cursor.value + 1) % get(items).length;
  };

  const reset = () => {
    cursor.value = CURSOR_NONE;
  };

  return {
    cursor,
    previous,
    next,
    reset,
  };
};
