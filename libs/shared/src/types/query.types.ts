import {type ComputedRef, type DeepReadonly, type Ref} from 'vue';
import {type PromiseOr} from '@myparcel/ts-utils';

export interface StorableMap<T, K> {
  storage: Ref<Map<string, T>>;

  clear(): void;

  get<T1 extends T>(key: K): T1;

  has(key: K): boolean;

  set<T1 extends T>(key: K, value: T1): T1;
}

export interface RequestHandler<T> {
  data: DeepReadonly<Ref<T | null>>;
  loading: ComputedRef<boolean>;

  load(): Promise<void>;
}

export interface UseRequestOptions<T> {
  fallback?: T;

  onError?(error: unknown, queryKey: RequestKey): PromiseOr<void>;

  onSuccess?(data: T): PromiseOr<void>;
}

export type RequestKey = (string | object | RequestKey)[];

export type RequestStorage = StorableMap<unknown, RequestKey>;
