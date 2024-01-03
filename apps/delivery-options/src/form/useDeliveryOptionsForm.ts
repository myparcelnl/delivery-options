import {FORM_NAME_DELIVERY_OPTIONS, type InternalOutput} from '@myparcel-do/shared';
import {type FormInstance, useFormBuilder} from '@myparcel/vue-form-builder';

export const useDeliveryOptionsForm = (): FormInstance<InternalOutput> => {
  const formBuilder = useFormBuilder();

  return formBuilder.getForm(FORM_NAME_DELIVERY_OPTIONS);
};
