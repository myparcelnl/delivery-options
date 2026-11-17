import {computed, type ComputedRef, type MaybeRef, toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {CURRENCY_DEFAULT} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';

const createPriceFormatter = useMemoize(
  (locale: string, currency: string): Intl.NumberFormat => new Intl.NumberFormat(locale, {style: 'currency', currency}),
);

/**
 * Formats a price in the configured currency and locale.
 */
export const useFormatPrice = (price: MaybeRef<number>): ComputedRef<string> => {
  const {locale} = useLanguage();
  const {state: config} = useConfigStore();

  return computed(() => createPriceFormatter(locale.value, config.currency ?? CURRENCY_DEFAULT).format(toValue(price)));
};
