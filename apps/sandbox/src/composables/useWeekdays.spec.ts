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

  it('returns weekdays in English for en-US', async () => {
    vi.mock('./useLanguage', () => ({
      useLanguage: vi.fn(() => ({
        language: {value: {code: 'en-US'}},
      })),
    }));

    const {useWeekdays} = await import('./useWeekdays');
    await nextTick();

    const weekdays = useWeekdays();

    expect(weekdays.value).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  });
});
