/**
 * Remove every key from a store's reactive state object, keeping the same object so that
 * everything watching it stays connected.
 *
 * @param state - The reactive state object to empty.
 */
export const clearState = (state: object): void => {
  for (const key of Object.keys(state)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (state as Record<string, unknown>)[key];
  }
};
