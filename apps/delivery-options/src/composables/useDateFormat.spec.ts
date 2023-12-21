import {reactive} from 'vue';
import {afterEach, beforeEach, describe, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useI18nStore} from '../stores';
import {useDateFormat} from './useDateFormat';

describe.concurrent('useDateFormat', (it) => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns date in various formats', ({expect}) => {
    const date = new Date('2021-05-25T12:00:00');
    vi.setSystemTime(date.getTime());

    const formatted = useDateFormat(date);

    const {date: _, ...refs} = reactive(formatted);

    expect(refs).toEqual({
      standard: 'dinsdag 25 mei',
      relative: 'vandaag',
      time: '12:00',
      weekday: 'dinsdag',
    });
  });

  it('reacts to locale changes', ({expect}) => {
    const i18n = useI18nStore();

    const date = new Date('2021-05-25T12:00:00');
    const {standard} = useDateFormat(date);

    expect(standard.value).toBe('dinsdag 25 mei');
    i18n.setLocale('en-US');
    expect(standard.value).toBe('Tuesday, May 25');
  });

  it('can parse api date strings', ({expect}) => {
    const formatted = useDateFormat('2021-05-25 14:12:00.000000');

    expect(formatted.date.value).toEqual(new Date('2021-05-25T14:12:00.000Z'));
  });
});
