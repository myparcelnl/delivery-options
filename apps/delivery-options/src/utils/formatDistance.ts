import {computed, type MaybeRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {useLanguage} from '../composables';

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
    const resolvedDistance = Math.round(Number(distance));
    const useKm = resolvedDistance >= M_TO_KM;

    const formatter = createDistanceFormatter(locale.value, useKm);

    return formatter.format(useKm ? resolvedDistance / M_TO_KM : resolvedDistance);
  });
};
