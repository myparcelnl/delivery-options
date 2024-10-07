import {computed, type ComputedRef} from 'vue';
import {setDay} from 'date-fns';
import {useLanguage} from './useLanguage';

export const useWeekdays = (): ComputedRef<string[]> => {
  const language = useLanguage();

  return computed(() => {
    return Array.from({length: 7}, (_, i) => {
      const date = setDay(new Date(), i, {weekStartsOn: 0});

      return date.toLocaleDateString(language.language.value.code, {weekday: 'long'});
    });
  });
};
