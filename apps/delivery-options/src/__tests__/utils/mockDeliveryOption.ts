import {assign} from 'radash';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {CarrierId, CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type ResolvedDeliveryOptions} from '../../types';

const DEFAULT_DELIVERY_OPTION = Object.freeze({
  date: '',
  time: '',
  carrier: {
    name: CarrierName.PostNl,
    id: CarrierId.PostNl,
    identifier: CarrierName.PostNl,
    human: 'PostNL',
    meta: {
      logo_png: '/path/to/logo.png',
      logo_svg: '/path/to/logo.svg',
    },
  },
  deliveryType: DeliveryTypeName.Standard,
  packageType: PackageTypeName.Package,
  shipmentOptions: [
    {
      name: ShipmentOptionName.Signature,
      schema: {
        type: 'boolean',
        enum: [true, false],
      },
    },
  ],
} satisfies ResolvedDeliveryOptions);

export const mockDeliveryOption = (option: RecursivePartial<ResolvedDeliveryOptions> = {}): ResolvedDeliveryOptions => {
  return {
    ...assign(DEFAULT_DELIVERY_OPTION, option),
    shipmentOptions: option.shipmentOptions ?? DEFAULT_DELIVERY_OPTION.shipmentOptions,
  } as ResolvedDeliveryOptions;
};
