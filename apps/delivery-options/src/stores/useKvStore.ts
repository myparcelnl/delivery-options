import {reactive} from 'vue';

const kvState = reactive<Record<string, unknown>>({});

export function useKvStore() {
  function set(key: string, value: unknown) {
    kvState[key] = value;
  }

  function get<T = unknown>(key: string): T | undefined {
    return kvState[key] as T | undefined;
  }

  function reset() {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(kvState).forEach((key) => delete kvState[key]);
  }

  return {set, get, reset, state: kvState};
}
