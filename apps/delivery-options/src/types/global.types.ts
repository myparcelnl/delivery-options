import {type InputDeliveryOptionsConfiguration, type DeliveryOptionsConfiguration} from '@myparcel-do/shared';

declare global {
  export interface Window {
    MyParcelConfig: InputDeliveryOptionsConfiguration | DeliveryOptionsConfiguration;
  }
}

export {};
