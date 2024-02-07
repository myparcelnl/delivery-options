import {computed, type MaybeRef, toValue, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useLanguage} from './useLanguage';

const METER = 'meter';
const M_TO_KM = 1000;

const createDistanceFormatter = useMemoize(
  (locale: string, useKm: boolean): Intl.NumberFormat =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: useKm ? `kilo${METER}` : METER,
      unitDisplay: 'narrow',
      maximumFractionDigits: useKm ? 1 : 0,
    }),
);

export const useFormatDistance = (distance: MaybeRef<number | string>): ComputedRef<string> => {
  const {locale} = useLanguage();

  return computed(() => {
    const resolvedDistance = Math.round(Number(toValue(distance)));
    const useKm = resolvedDistance >= M_TO_KM;

    const formatter = createDistanceFormatter(locale.value, useKm);

    return formatter.format(useKm ? resolvedDistance / M_TO_KM : resolvedDistance);
  });
};
