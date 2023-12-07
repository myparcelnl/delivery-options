import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {useLanguage} from './useLanguage';

export const useWeekdays = (): ComputedRef<string[]> => {
  const language = useLanguage();

  return computed(() => {
    return Array.from({length: 7}, (_, i) => {
      const date = new Date(0);
      date.setDate(i + 5);

      return date.toLocaleDateString(language.language.value.code, {weekday: 'long'});
    });
  });
};
