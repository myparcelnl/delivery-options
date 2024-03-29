import {type MaybeRef, onUnmounted, type Ref, ref, toValue} from 'vue';
import {snake} from 'radash';

const links = ref(new Map<string, string>());

interface UseAnchorLink {
  links: Ref<Map<string, string>>;
  register(key: MaybeRef<string>, label?: MaybeRef<string | undefined>): string;
  remove(key: MaybeRef<string>): void;
}

export const useAnchorLink = (): UseAnchorLink => {
  const toAnchor = (key: Ref<string> | string): string => snake(toValue(key));

  const register = (key: MaybeRef<string>, label?: string): string => {
    const anchor = toAnchor(key);

    links.value.set(anchor, toValue(label) ?? toValue(key));

    onUnmounted(() => {
      if (!links.value.has(toValue(key))) {
        return;
      }

      links.value.delete(toValue(key));
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
