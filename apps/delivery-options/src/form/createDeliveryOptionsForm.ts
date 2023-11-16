import {FORM_NAME_DELIVERY_OPTIONS, useDeliveryOptionsConfig} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = () => {
  const config = useDeliveryOptionsConfig();

  return createForm(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: (string: string) => {
      console.log('render label', string);
      return string;
    },
    // @ts-expect-error todo
    initialValues: config.data.initial ?? {},
  });
};
