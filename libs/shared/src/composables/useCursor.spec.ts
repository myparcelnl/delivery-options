import {ref} from 'vue';
import {describe, expect, it} from 'vitest';
import {useCursor} from './useCursor';

describe('useCursor', () => {
  it('can go to the next option', () => {
    const items = ref(['a', 'b', 'c']);
    const {cursor, next} = useCursor({items});

    expect(cursor.value).toBe(-1);

    next();
    expect(cursor.value).toBe(0);
    next();
    expect(cursor.value).toBe(1);
    next();
    expect(cursor.value).toBe(2);
    next();
    expect(cursor.value).toBe(0);
  });

  it('can go to the previous option', () => {
    const items = ['a', 'b', 'c'];
    const {cursor, previous} = useCursor({items});

    expect(cursor.value).toBe(-1);

    previous();
    expect(cursor.value).toBe(2);
    previous();
    expect(cursor.value).toBe(1);
    previous();
    expect(cursor.value).toBe(0);
    previous();
    expect(cursor.value).toBe(2);
  });

  it('can reset the cursor', () => {
    const items = ref(['a', 'b', 'c']);
    const {cursor, next, reset} = useCursor({items});

    expect(cursor.value).toBe(-1);

    next();
    expect(cursor.value).toBe(0);
    reset();
    expect(cursor.value).toBe(-1);
  });
});
