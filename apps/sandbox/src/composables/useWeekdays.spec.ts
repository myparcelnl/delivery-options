import {nextTick} from 'vue';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';

/**
 * @vitest-environment happy-dom
 */

describe('useWeekdays', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('uses weekdays', async () => {
    expect.assertions(1);

    const {useWeekdays} = await import('./useWeekdays');
    await nextTick();

    const Weekdays = useWeekdays();

    expect(Weekdays.value).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  });
});
