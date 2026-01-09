import {isString} from 'radash';
import {type Replace} from '@myparcel-dev/ts-utils';
import {type InternalOutput} from '@myparcel-dev/do-shared';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel-dev/constants';
import {type SelectedDeliveryMoment} from '../../types';
import {
  HOME_OR_PICKUP_HOME,
  FIELD_DELIVERY_DATE,
  FIELD_HOME_OR_PICKUP,
  FIELD_PICKUP_LOCATION,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_MOMENT,
} from '../../data';
import {useSelectedValues} from '../../composables';
import {useSelectedPickupLocation} from '../../composables';

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
 * Set the selected delivery options in the reactive stores.
 */
export const mockSelectedDeliveryOptions = (values?: Partial<MockInternalOutput>) => {
  const selectedValues = useSelectedValues();

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

  // Set values in reactive stores
  selectedValues.deliveryDate.value = resolvedValues[FIELD_DELIVERY_DATE];
  selectedValues.homeOrPickup.value = resolvedValues[FIELD_HOME_OR_PICKUP];
  selectedValues.pickupLocation.value = resolvedValues[FIELD_PICKUP_LOCATION];
  selectedValues.shipmentOptions.value = resolvedValues[FIELD_SHIPMENT_OPTIONS];
  selectedValues.deliveryMoment.value = resolvedValues[FIELD_DELIVERY_MOMENT];

  const {locationCode} = useSelectedPickupLocation();

  locationCode.value = resolvedValues[FIELD_PICKUP_LOCATION] ?? undefined;

  const {carrier} = useSelectedValues();
  carrier.value = CarrierName.PostNl;

  return selectedValues;
};
