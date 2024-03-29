import {type RecursivePartial} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../../types';

const DEFAULT_DELIVERY_OPTION = Object.freeze({
  date: '',
  time: '',
  carrier: CarrierName.PostNl,
  deliveryType: DeliveryTypeName.Standard,
  packageType: PackageTypeName.Package,
  shipmentOptions: [],
} satisfies SelectedDeliveryMoment);

export const mockResolvedDeliveryOption = (
  option: RecursivePartial<SelectedDeliveryMoment> = {},
): SelectedDeliveryMoment => {
  return {...DEFAULT_DELIVERY_OPTION, ...option} as SelectedDeliveryMoment;
};
