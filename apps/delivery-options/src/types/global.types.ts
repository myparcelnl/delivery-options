import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

declare global {
  export interface Window {
    MyParcelConfig: InputDeliveryOptionsConfiguration;
  }
}

export {};
