import {reactive, toRefs, type Ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  FIELD_HOME_OR_PICKUP,
  HOME_OR_PICKUP_HOME,
  FIELD_DELIVERY_DATE,
  FIELD_DELIVERY_MOMENT,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_PICKUP_LOCATION,
} from '../data';

interface UseSelectedValues {
  deliveryDate: Ref<string | undefined>;
  deliveryMoment: Ref<string | undefined>;
  homeOrPickup: Ref<string>;
  pickupLocation: Ref<string | undefined>;
  shipmentOptions: Ref<string[]>;
}

export const useSelectedValues = useMemoize((): UseSelectedValues => {
  const values = reactive({
    [FIELD_HOME_OR_PICKUP]: HOME_OR_PICKUP_HOME,
    [FIELD_DELIVERY_DATE]: undefined,
    [FIELD_DELIVERY_MOMENT]: undefined,
    [FIELD_SHIPMENT_OPTIONS]: [],
    [FIELD_PICKUP_LOCATION]: undefined,
  });

  return toRefs(values);
});
