import {isString} from 'radash';
import {type InternalOutput} from '@myparcel-do/shared';
import {type FormInstance} from '@myparcel/vue-form-builder';
import {type Replace} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../../types';
import {useDeliveryOptionsForm} from '../../form';
import {
  HOME_OR_PICKUP_HOME,
  FIELD_DELIVERY_DATE,
  FIELD_HOME_OR_PICKUP,
  FIELD_PICKUP_LOCATION,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_MOMENT,
} from '../../data';
import {useSelectedPickupLocation, useSelectedValues} from '../../composables';

type MockInternalOutput = Replace<InternalOutput, 'deliveryMoment', string | Partial<SelectedDeliveryMoment>>;

const DELIVERY_MOMENT_DEFAULTS = Object.freeze({
  date: '',
  time: '',
  carrier: CarrierName.PostNl,
  deliveryType: DeliveryTypeName.Standard,
  packageType: PackageTypeName.Package,
  shipmentOptions: [],
});

/**
 * Set the selected delivery options in the form.
 */
export const mockSelectedDeliveryOptions = (values?: Partial<MockInternalOutput>): FormInstance<InternalOutput> => {
  const {instance: form} = useDeliveryOptionsForm();

  const resolvedDeliveryMoment = isString(values?.[FIELD_DELIVERY_MOMENT])
    ? values?.[FIELD_DELIVERY_MOMENT]
    : JSON.stringify({...DELIVERY_MOMENT_DEFAULTS, ...values?.[FIELD_DELIVERY_MOMENT]});

  const resolvedValues = {
    [FIELD_DELIVERY_DATE]: '',
    [FIELD_HOME_OR_PICKUP]: HOME_OR_PICKUP_HOME,
    [FIELD_PICKUP_LOCATION]: undefined,
    [FIELD_SHIPMENT_OPTIONS]: [],
    ...values,
    [FIELD_DELIVERY_MOMENT]: resolvedDeliveryMoment,
  } satisfies InternalOutput;

  form.setValues(resolvedValues);

  const {locationCode} = useSelectedPickupLocation();

  locationCode.value = resolvedValues[FIELD_PICKUP_LOCATION] ?? undefined;

  const {carrier} = useSelectedValues();
  carrier.value = CarrierName.PostNl;

  return form;
};
