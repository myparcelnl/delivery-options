import {FORM_NAME_DELIVERY_OPTIONS, useDeliveryOptionsStore, useLanguage} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = () => {
  const store = useDeliveryOptionsStore();
  const {translate} = useLanguage();

  return createForm(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: translate,
    initialValues: store.configuration.initial ?? {},
  });
};
