import {FORM_NAME_DELIVERY_OPTIONS, type InternalOutput} from '@myparcel-do/shared';
import {createForm} from '@myparcel/vue-form-builder';
import {useConfigStore} from '../stores';
import {useLanguage} from '../composables';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDeliveryOptionsForm = () => {
  const config = useConfigStore();

  const {translate} = useLanguage();

  return createForm<InternalOutput>(FORM_NAME_DELIVERY_OPTIONS, {
    renderLabel: translate,
    // initialValues: {
    //   [FIELD_HOME_OR_PICKUP]:
    //     config.initial?.deliveryType === DeliveryTypeName.Pickup ? HOME_OR_PICKUP_PICKUP : HOME_OR_PICKUP_HOME,
    //   [FIELD_DELIVERY_DATE]: config.initial?.date,
    //   [FIELD_DELIVERY_MOMENT]: JSON.stringify({
    //     carrier: config.initial?.carrier,
    //     date: config.initial?.date,
    //     deliveryType: config.initial?.deliveryType,
    //     packageType: config.initial?.packageType,
    //   }),
    //   [FIELD_SHIPMENT_OPTIONS]: [],
    // },
  });
};
