import {type MaybeRef, onUnmounted, type Ref, ref} from 'vue';
import {snake} from 'radash';
import {get} from '@vueuse/core';

const links = ref(new Map<string, string>());

interface UseAnchorLink {
  links: Ref<Map<string, string>>;
  register(key: MaybeRef<string>, label?: string): string;
  remove(key: MaybeRef<string>): void;
}

export const useAnchorLink = (): UseAnchorLink => {
  const toAnchor = (key: Ref<string> | string): string => snake(get(key));

  const register = (key: MaybeRef<string>, label?: string): string => {
    const anchor = toAnchor(key);

    links.value.set(anchor, label ?? get(key));

    onUnmounted(() => {
      if (!links.value.has(get(key))) {
        return;
      }

      links.value.delete(get(key));
    });

    return anchor;
  };

  const remove = (key: MaybeRef<string>) => {
    links.value.delete(toAnchor(key));
  };

  return {
    links,
    register,
    remove,
  };
};
