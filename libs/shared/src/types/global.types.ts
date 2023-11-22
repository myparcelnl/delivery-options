import {type InputDeliveryOptionsConfiguration} from './config.types';

declare global {
  export interface Window {
    MyParcelConfig: InputDeliveryOptionsConfiguration;
  }
}

export {};
