import {
  FORM_NAME_DELIVERY_OPTIONS,
  type InternalOutput,
  useDeliveryOptionsStore,
  useLanguage,
} from '@myparcel-do/shared';
import {type CreatedForm, createForm} from '@myparcel/vue-form-builder';

interface FormFields {
  [FORM_NAME_DELIVERY_OPTIONS]: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = (): CreatedForm<InternalOutput> => {
  const store = useDeliveryOptionsStore();
  const {translate} = useLanguage();

  const initialConfiguration = store.configuration.initial;

  return createForm<InternalOutput>(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: translate,
    initialValues: {
      deliveryDate: initialConfiguration?.date,
      deliveryMoment: JSON.stringify({
        carrier: initialConfiguration?.carrier,
        date: initialConfiguration?.date,
        deliveryType: initialConfiguration?.deliveryType,
        packageType: initialConfiguration?.packageType,
      }),
      shipmentOptions: [],
    },
  });
};
