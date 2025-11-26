import {type InternalOutput} from '@myparcel-dev/shared';
import {type Replace} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel-dev/constants';
import {MOCK_DEFAULT_DATE} from '../constants';
import {type SelectedDeliveryMoment} from '../../types';
import {
  FIELD_HOME_OR_PICKUP,
  HOME_OR_PICKUP_HOME,
  FIELD_DELIVERY_DATE,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_MOMENT,
} from '../../data';

export const createInternalOutput = (
  overrides: Partial<Replace<InternalOutput, 'deliveryMoment', Partial<SelectedDeliveryMoment>>> = {},
): InternalOutput => {
  return {
    [FIELD_HOME_OR_PICKUP]: HOME_OR_PICKUP_HOME,
    [FIELD_DELIVERY_DATE]: MOCK_DEFAULT_DATE,
    [FIELD_SHIPMENT_OPTIONS]: [],
    ...overrides,
    [FIELD_DELIVERY_MOMENT]: JSON.stringify({
      carrier: CarrierName.PostNl,
      date: overrides[FIELD_DELIVERY_MOMENT]?.date ?? overrides[FIELD_DELIVERY_DATE] ?? MOCK_DEFAULT_DATE,
      deliveryType: DeliveryTypeName.Standard,
      packageType: PackageTypeName.Package,
      shipmentOptions: [],
      time: '',
      ...overrides.deliveryMoment,
    } satisfies SelectedDeliveryMoment),
  };
};
