import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {useFormBuilder} from '@myparcel/vue-form-builder';
import {type DeliveryOptionsOutput} from '../types';
import {FORM_NAME_DELIVERY_OPTIONS} from '../constants';

interface Output {
  values: ComputedRef<DeliveryOptionsOutput>;
}

export const useOutput = (): Output => {
  const formBuilder = useFormBuilder();

  return {
    values: computed(() => {
      const form = formBuilder.getForm(FORM_NAME_DELIVERY_OPTIONS);

      if (!form) {
        throw new Error('Form not found');
      }

      return form.getValues() as unknown as DeliveryOptionsOutput;
    }),
  };
};
