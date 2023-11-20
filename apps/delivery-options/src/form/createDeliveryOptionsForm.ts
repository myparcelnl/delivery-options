import {FORM_NAME_DELIVERY_OPTIONS, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = () => {
  const store = useDeliveryOptionsStore();

  return createForm(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: (string: string) => {
      console.log('render label', string);
      return string;
    },
    initialValues: store.configuration.initial ?? {},
  });
};
