import {isString} from 'radash';
import {type InternalOutput} from '@myparcel-do/shared';
import {type FormInstance} from '@myparcel/vue-form-builder';
import {type Replace} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../../types';
import {useDeliveryOptionsForm} from '../../form';
import {HOME_OR_PICKUP_HOME} from '../../data';

type MockInternalOutput = Replace<InternalOutput, 'deliveryMoment', string | Partial<SelectedDeliveryMoment>>;

const DELIVERY_MOMENT_DEFAULTS = Object.freeze({
  date: '',
  time: '',
  carrier: CarrierName.PostNl,
  deliveryType: DeliveryTypeName.Standard,
  packageType: PackageTypeName.Package,
  shipmentOptions: [],
});

export const mockSelectedDeliveryOptions = (values?: Partial<MockInternalOutput>): FormInstance<InternalOutput> => {
  const {instance: form} = useDeliveryOptionsForm();

  const resolvedDeliveryMoment = isString(values?.deliveryMoment)
    ? values?.deliveryMoment
    : JSON.stringify({...DELIVERY_MOMENT_DEFAULTS, ...values?.deliveryMoment});

  const resolvedValues = {
    deliveryDate: '',
    homeOrPickup: HOME_OR_PICKUP_HOME,
    pickupLocation: undefined,
    shipmentOptions: [],
    ...values,
    deliveryMoment: resolvedDeliveryMoment,
  } satisfies InternalOutput;

  form.setValues(resolvedValues);

  return form;
};
