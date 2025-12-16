import {type WatchSource, watch, type WatchOptions} from 'vue';
import {type AnyFn} from '@vueuse/core';
import {type PromiseOr} from '@myparcel-dev/ts-utils';

const checkCondition = (value: unknown, condition?: AnyFn): PromiseOr<boolean> => {
  if (condition) {
    return condition(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value);
};

export type WatchUntilOptions<T> = WatchOptions & {
  condition?(value: T): PromiseOr<boolean>;
};

export const watchUntil = <T>(source: WatchSource<T>, options?: WatchUntilOptions<T>): Promise<void> => {
  return new Promise((resolve) => {
    const unwatch = watch(
      source,
      async (value) => {
        const condition = await checkCondition(value, options?.condition);

        if (!condition) {
          return;
        }

        unwatch();
        resolve(undefined);
      },
      {
        immediate: true,
        ...options,
      },
    );
  });
};
