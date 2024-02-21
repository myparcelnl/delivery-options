import {type MaybeRef, toValue} from 'vue';

/**
 * Placed outside the utils folder on purpose, to avoid circular dependencies.
 */
export const resolveRefKey = (...args: MaybeRef<unknown>[]): string => JSON.stringify(args.map((arg) => toValue(arg)));
