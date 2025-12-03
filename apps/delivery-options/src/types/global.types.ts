import {type InputDeliveryOptionsConfiguration, type DeliveryOptionsConfiguration} from '@myparcel-dev/shared';

declare global {
  export interface Window {
    MyParcelConfig: InputDeliveryOptionsConfiguration | DeliveryOptionsConfiguration;
  }
}

export {};
