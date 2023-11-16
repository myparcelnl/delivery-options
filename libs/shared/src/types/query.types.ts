import {type ComputedRef, type DeepReadonly, type Ref} from 'vue';
import {type PromiseOr} from '@myparcel/ts-utils';
import {type Keyable} from './common.types';

export interface Query<T = unknown> {
  data: DeepReadonly<Ref<T | null>>;
  loading: ComputedRef<boolean>;

  suspense(): Promise<void>;
}

export interface UseQueryOptions<Cb extends QueryCallback> {
  onSuccess(data: Awaited<ReturnType<Cb>>): PromiseOr<void>;
}

export type QueryCallback<T = unknown> = () => PromiseOr<T>;

export type QueryKey = Record<string, Keyable> | string | string[];

export type UseQuery = <Cb extends QueryCallback>(
  queryKey: QueryKey,
  callback: Cb,
  options?: UseQueryOptions<Cb>,
) => Query<Awaited<ReturnType<Cb>>>;
