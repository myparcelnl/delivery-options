import {type DeliveryOptionsOutput} from '@myparcel-dev/shared';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {MOCK_DEFAULT_DATE} from '../constants';

export const createExternalOutput = (overrides: Partial<DeliveryOptionsOutput> = {}): DeliveryOptionsOutput => {
  return {
    carrier: CarrierName.PostNl,
    date: MOCK_DEFAULT_DATE,
    deliveryType: DeliveryTypeName.Standard,
    isPickup: false,
    packageType: PackageTypeName.Package,
    shipmentOptions: {},
    ...overrides,
  } as DeliveryOptionsOutput;
};
