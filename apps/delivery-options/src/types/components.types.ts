import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {type DeliveryOptionsOutput} from './output.types';

export interface DeliveryOptionsProps {
  configuration?: InputDeliveryOptionsConfiguration;
}

export type DeliveryOptionsEmits = (event: 'update', values: DeliveryOptionsOutput) => void;
