import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {type DeliveryOptionsOutput, FORM_NAME_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {useFormBuilder} from '@myparcel/vue-form-builder';

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
