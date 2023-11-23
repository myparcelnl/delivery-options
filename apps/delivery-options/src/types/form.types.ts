import {type DeepReadonly} from 'vue';
import {type DeliveryOptionsCarrier} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: DeliveryOptionsCarrier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: string;
}
