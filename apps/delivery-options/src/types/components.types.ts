import {type DeliveryOptionsOutput, type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

export interface DeliveryOptionsProps {
  configuration?: InputDeliveryOptionsConfiguration;
}

export type DeliveryOptionsEmits = (event: 'update', values: DeliveryOptionsOutput) => void;
