import type {CarrierIdentifier} from '@myparcel-do/shared';
import {reactive, toRefs, type Ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  FIELD_HOME_OR_PICKUP,
  HOME_OR_PICKUP_HOME,
  FIELD_DELIVERY_DATE,
  FIELD_DELIVERY_MOMENT,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_PICKUP_LOCATION,
  FIELD_CARRIER,
} from '../data';

interface UseSelectedValues {
  carrier: Ref<CarrierIdentifier | undefined>;
  clearSelectedValues: () => void;
  deliveryDate: Ref<string | undefined>;
  deliveryMoment: Ref<string | undefined>;
  homeOrPickup: Ref<string>;
  pickupLocation: Ref<string | undefined>;
  shipmentOptions: Ref<string[]>;
}

export const useSelectedValues = useMemoize((): UseSelectedValues => {
  const initialValues = {
    [FIELD_HOME_OR_PICKUP]: HOME_OR_PICKUP_HOME,
    [FIELD_DELIVERY_DATE]: undefined,
    [FIELD_DELIVERY_MOMENT]: undefined,
    [FIELD_SHIPMENT_OPTIONS]: [],
    [FIELD_PICKUP_LOCATION]: undefined,
    [FIELD_CARRIER]: undefined,
  };

  const values = reactive({...initialValues});

  const clearSelectedValues = () => {
    Object.assign(
      values,
      Object.fromEntries(Object.entries(initialValues).filter(([key]) => key !== FIELD_DELIVERY_DATE)),
    );
  };

  return {
    ...toRefs(values),
    clearSelectedValues,
  };
});
