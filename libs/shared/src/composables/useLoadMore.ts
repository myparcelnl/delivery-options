import {type MaybeRef, ref, computed, toValue, type ComputedRef, type Ref, onActivated, onMounted} from 'vue';
import {isDef} from '@vueuse/core';

export type UseLoadMoreOptions<Item = unknown> = {
  step?: number;
  start?: number;
  items: Readonly<MaybeRef<Item[]>> | MaybeRef<Item[]>;
  isSelected?(item: Item): boolean;
};

export type UseLoadMore<Item = unknown> = {
  loadMore(): void;
  hasMore: ComputedRef<boolean>;
  loaded: Ref<number>;
  items: ComputedRef<Item[]>;
};

export const useLoadMore = <Item = unknown>(options: UseLoadMoreOptions<Item>): UseLoadMore<Item> => {
  const loaded = ref(options.start ?? options.step ?? 1);

  const hasMore = computed(() => loaded.value < toValue(options.items).length);

  const loadMore = () => {
    if (!hasMore.value) {
      return;
    }

    const step = options.step ?? 1;

    const maxLength = toValue(options.items).length;

    if (loaded.value + step > maxLength) {
      loaded.value = maxLength;
    } else {
      loaded.value += step;
    }
  };

  const items = computed(() => toValue(options.items).slice(0, loaded.value));

  if (isDef(options.isSelected)) {
    const loadMoreIfInvisible = () => {
      if (!hasMore.value) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const isLoaded = items.value.find(options.isSelected!);

      if (isLoaded) {
        return;
      }

      loadMore();
      loadMoreIfInvisible();
    };

    onActivated(loadMoreIfInvisible);
    onMounted(loadMoreIfInvisible);
  }

  return {
    items,
    loaded,
    hasMore,
    loadMore,
  };
};
