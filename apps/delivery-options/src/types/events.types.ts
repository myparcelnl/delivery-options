import {type InputDeliveryOptionsConfiguration} from '@myparcel-dev/shared';

export interface IncomingEventDetail extends InputDeliveryOptionsConfiguration {
  selector?: string;
}
