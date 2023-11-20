import {type DeliveryOptionsConfiguration} from './config.types';

declare global {
  export interface Window {
    MyParcelConfig: DeliveryOptionsConfiguration;
  }
}

export {};
