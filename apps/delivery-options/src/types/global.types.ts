import {type InputDeliveryOptionsConfiguration, type DeliveryOptionsConfiguration} from '@myparcel-dev/do-shared';

declare global {
  export interface Window {
    MyParcelConfig: InputDeliveryOptionsConfiguration | DeliveryOptionsConfiguration;
  }
}

export {};
