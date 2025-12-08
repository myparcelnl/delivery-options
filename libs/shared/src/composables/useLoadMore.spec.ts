import {defineComponent, h} from 'vue';
import {describe, it, expect, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {render} from '@testing-library/vue';
import {useLoadMore} from '@myparcel-dev/shared';

describe('useLoadMore', () => {
  it('shows an initial set of items', () => {
    const {items} = useLoadMore({
      items: ['a', 'b', 'c'],
    });

    expect(items.value).toEqual(['a']);
  });

  it('shows a custom amount of initial items', () => {
    const {items} = useLoadMore({
      items: ['a', 'b', 'c'],
      start: 2,
    });

    expect(items.value).toEqual(['a', 'b']);
  });

  it('can step through items', () => {
    const {items, loadMore, hasMore, loaded} = useLoadMore({
      items: ['a', 'b', 'c'],
    });

    loadMore();
    expect(items.value).toEqual(['a', 'b']);
    expect(hasMore.value).toBe(true);
    expect(loaded.value).toBe(2);

    loadMore();
    expect(items.value).toEqual(['a', 'b', 'c']);
    expect(hasMore.value).toBe(false);
    expect(loaded.value).toBe(3);

    loadMore();
    expect(items.value).toEqual(['a', 'b', 'c']);
    expect(hasMore.value).toBe(false);
    expect(loaded.value).toBe(3);
  });

  it('can step through items with a custom step', () => {
    const {items, loadMore, hasMore, loaded} = useLoadMore({
      items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
      start: 1,
      step: 3,
    });

    expect(items.value).toEqual(['a']);
    expect(hasMore.value).toBe(true);
    expect(loaded.value).toBe(1);

    loadMore();
    expect(items.value).toEqual(['a', 'b', 'c', 'd']);
    expect(hasMore.value).toBe(true);
    expect(loaded.value).toBe(4);

    loadMore();
    expect(items.value).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(hasMore.value).toBe(true);
    expect(loaded.value).toBe(7);

    loadMore();
    expect(items.value).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);
    expect(hasMore.value).toBe(false);
    expect(loaded.value).toBe(9);
  });

  it('loads until the selected item is visible when isSelected is passed', async () => {
    // This functionality needs a component instance to use activated and onMounted hooks
    const component = render(
      defineComponent({
        setup() {
          return useLoadMore({
            items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
            isSelected: (item) => item === 'g',
          });
        },

        render() {
          return h(
            'div',
            this.items.map((item) => h('span', {role: 'item'}, item)),
          );
        },
      }),
    );

    await flushPromises();
    // Wait for items to load
    await vi.waitUntil(() => component.getAllByRole('item').length > 1);

    const spans = component.getAllByRole('item').map((span) => span.textContent);

    expect(spans).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });
});
