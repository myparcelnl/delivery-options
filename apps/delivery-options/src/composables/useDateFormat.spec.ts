import {reactive} from 'vue';
import {afterEach, beforeEach, describe, vi} from 'vitest';
import {useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';
import {useDateFormat} from './useDateFormat';

describe.concurrent('useDateFormat', (it) => {
  beforeEach(() => {
    useConfigStore().reset();

    const {setLocale} = useLanguage();
    setLocale('nl-NL');
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns date in various formats', ({expect}) => {
    const now = new Date('2021-05-23T12:00:00');
    vi.setSystemTime(now.getTime());

    // 2 days later
    const date = new Date('2021-05-25T12:00:00');
    const formatted = useDateFormat(date);

    const {date: _, ...refs} = reactive(formatted);

    expect(refs).toEqual({
      day: '25',
      month: 'mei',
      relative: 'overmorgen',
      relativeWeekday: 'Dinsdag',
      standard: 'dinsdag 25 mei',
      time: '12:00',
      weekday: 'Dinsdag',
    });
  });

  it('reacts to locale changes', ({expect}) => {
    const {setLocale} = useLanguage();

    const date = new Date('2021-05-25T12:00:00');
    const {standard} = useDateFormat(date);

    expect(standard.value).toBe('dinsdag 25 mei');
    setLocale('en-US');
    expect(standard.value).toBe('Tuesday, May 25');
  });

  it('can parse api date strings', ({expect}) => {
    const formatted = useDateFormat('2021-05-25 14:12:00.000000');

    const expected = new Date(2021, 4, 25, 14, 12, 0);

    expect(formatted.date.value).toEqual(expected);
  });
});
