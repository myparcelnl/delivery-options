import {type CustomValidator} from '../types';

export enum OptionGroup {
  PackageType = 'packageType',
  Delivery = 'delivery',
  ShipmentOption = 'shipmentOption',
  Feature = 'feature',
  DropOff = 'dropOff',
}

export enum OptionType {
  String = 'string',
  Boolean = 'boolean',
  Number = 'number',
  Currency = 'currency',
  Date = 'date',
  Time = 'time',
  Select = 'select',
}

export interface ConfigOption<T extends OptionType = OptionType> {
  hasCarrierToggle?: boolean;
  key: string;
  parents?: string[];
  type?: T;
  validators?: CustomValidator[];
}
