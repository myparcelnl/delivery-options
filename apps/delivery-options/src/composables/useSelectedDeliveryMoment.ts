import {computed, type ComputedRef} from 'vue';
import {useForm} from '@myparcel/vue-form-builder';
import {type ResolvedDeliveryOptions} from '../types';
import {FIELD_DELIVERY_MOMENT} from '../constants';

export const useSelectedDeliveryMoment = (): ComputedRef<ResolvedDeliveryOptions | undefined> => {
  const form = useForm();

  return computed(() => form.getValues()?.[FIELD_DELIVERY_MOMENT] as ResolvedDeliveryOptions | undefined);
};
