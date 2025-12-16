import {type InputDeliveryOptionsConfiguration} from '@myparcel-dev/do-shared';

export interface IncomingEventDetail extends InputDeliveryOptionsConfiguration {
  selector?: string;
}
