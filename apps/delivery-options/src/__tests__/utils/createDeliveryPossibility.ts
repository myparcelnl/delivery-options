import {addHours} from 'date-fns';
import {type DateLike, normalizeDate} from '@vueuse/core';
import {createDeliveryTimeframe} from '@myparcel-do/shared/testing';
import {type DeliveryOption} from '@myparcel/sdk';
import {DeliveryTypeName, PackageTypeName} from '@myparcel/constants';

export const createDeliveryPossibility = (
  date: DateLike,
  options: Partial<DeliveryOption['possibilities'][number]> = {},
): DeliveryOption['possibilities'][number] => {
  const normalizedDate = normalizeDate(date);

  return {
    type: DeliveryTypeName.Standard,
    package_type: PackageTypeName.Package,
    shipment_options: [],
    delivery_time_frames: [
      createDeliveryTimeframe(normalizedDate, 'start'),
      createDeliveryTimeframe(addHours(normalizedDate, 1), 'end'),
    ],
    ...options,
  };
};
