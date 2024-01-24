import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

export interface IncomingEventDetail extends InputDeliveryOptionsConfiguration {
  selector?: string;
}
