import {type MaybeRef} from 'vue';
import {get} from '@vueuse/core';

/**
 * Placed outside the utils folder on purpose, to avoid circular dependencies.
 */
export const resolveRefKey = (...args: MaybeRef<unknown>[]): string => JSON.stringify(args.map((arg) => get(arg)));
