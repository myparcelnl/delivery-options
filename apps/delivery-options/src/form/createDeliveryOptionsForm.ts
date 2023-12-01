import {FORM_NAME_DELIVERY_OPTIONS, type InternalOutput, useLanguage} from '@myparcel-do/shared';
import {type CreatedForm, createForm} from '@myparcel/vue-form-builder';
import {useConfigStore} from '../stores';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = (): CreatedForm<InternalOutput> => {
  const config = useConfigStore();

  const {translate} = useLanguage();

  return createForm<InternalOutput>(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: translate,
    initialValues: {
      deliveryDate: config.initial?.date,
      deliveryMoment: JSON.stringify({
        carrier: config.initial?.carrier,
        date: config.initial?.date,
        deliveryType: config.initial?.deliveryType,
        packageType: config.initial?.packageType,
      }),
      shipmentOptions: [],
    },
  });
};
