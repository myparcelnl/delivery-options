import {type Component} from 'vue';
import {type RecursiveRequired} from '@myparcel/ts-utils';
import {
  type CarrierName,
  type DeliveryTypeName,
  type PackageTypeName,
  type ShipmentOptionName,
} from '@myparcel/constants';
import {type ComponentName, type OptionType, type PickupLocationsView} from '../enums';
import {type SupportedPlatformName} from './platform.types';
import {type DeliveryOptionsAddress} from './address.types';

interface MapTileLayerData {
  attribution: string;
  maxZoom?: number;
  token?: string;
  url: string;
}

export interface FilterableOption {
  allow: boolean;
  items: string[];
}

export type DeliveryOptionsStrings = Record<string, string>;

export type CarrierIdentifier = `${CarrierName}:${number}` | CarrierName;

export type TimestampString = `${number}:${number}` | string;

export type Price = number | null;

// interface BeCarrierSettings extends BaseCarrierSettings {
//   allowSaturdayDelivery?: boolean;
//   fridayCutoffTime?: TimestampString;
// }
//
// interface NlCarrierSettings extends BaseCarrierSettings {
//   allowMondayDelivery?: boolean;
//   saturdayCutoffTime?: TimestampString;
// }

export interface CarrierSettings {
  allowDeliveryOptions?: boolean | FilterableOption;
  allowEveningDelivery?: boolean | FilterableOption;
  allowMondayDelivery?: boolean;
  allowMorningDelivery?: boolean | FilterableOption;
  allowOnlyRecipient?: boolean;
  allowPackageTypeDigitalStamp?: boolean;
  allowPackageTypeMailbox?: boolean;
  allowPackageTypePackage?: boolean;
  allowPickupLocations?: boolean | FilterableOption;
  allowSameDayDelivery?: boolean;
  allowSaturdayDelivery?: boolean;
  /** @deprecated use ShowDeliveryDate instead */
  allowShowDeliveryDate?: boolean;
  allowSignature?: boolean;
  allowStandardDelivery?: boolean | FilterableOption;
  cutoffTime?: TimestampString;
  cutoffTimeSameDay?: TimestampString;
  deliveryDaysWindow?: number;
  dropOffDays?: number[];
  dropOffDelay?: number;
  fridayCutoffTime?: TimestampString;
  packageType?: PackageTypeName;
  priceEveningDelivery?: Price;
  priceMondayDelivery?: Price;
  priceMorningDelivery?: Price;
  priceOnlyRecipient?: Price;
  pricePackageTypeDigitalStamp?: Price;
  pricePackageTypeMailbox?: Price;
  pricePickup?: Price;
  priceSameDayDelivery?: Price;
  priceSaturdayDelivery?: Price;
  priceSignature?: Price;
  priceStandardDelivery?: Price;
  saturdayCutoffTime?: TimestampString;
  showDeliveryDate?: boolean;
}

export type CarrierSettingsObject = Partial<Record<CarrierIdentifier, CarrierSettings>>;

export interface DeliveryOptionsConfig extends CarrierSettings {
  apiBaseUrl?: string;
  carrierSettings?: CarrierSettingsObject;
  /**
   * Currency. Defaults to format of the browser.
   */
  currency?: string | undefined;
  initial?: Partial<DeliveryOptionsOutput>;

  /**
   * Locale. Defaults to the language of the browser.
   */
  locale?: string | undefined;

  pickupLocationsDefaultView?: PickupLocationsView;
  pickupLocationsMapTileLayerData?: string | MapTileLayerData;
  pickupShowDistance?: boolean;
  platform?: SupportedPlatformName;
  showDeliveryDate?: boolean;
  showPriceSurcharge?: boolean;
  showPrices?: boolean;
}

export interface DeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  config: DeliveryOptionsConfig;
  initial?: Partial<DeliveryOptionsOutput>;
  strings: DeliveryOptionsStrings;
}

export interface InputDeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  components: Partial<Record<ComponentName, Component>>;
  config: DeliveryOptionsConfig;
  initial?: Partial<DeliveryOptionsOutput>;
  strings?: DeliveryOptionsStrings;
}

export interface ResolvedDeliveryOptionsConfiguration {
  address: RecursiveRequired<DeliveryOptionsAddress>;
  config: RecursiveRequired<DeliveryOptionsConfig>;
  strings: RecursiveRequired<DeliveryOptionsStrings>;
}

interface ShipmentOptionsOutput {
  onlyRecipient?: boolean;
  signature?: boolean;
}

interface BaseOutput {
  carrier: CarrierIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  isPickup: boolean;
  packageType: PackageTypeName;
  shipmentOptions: ShipmentOptionsOutput;
}

interface DeliveryOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Standard | DeliveryTypeName.Evening | DeliveryTypeName.Morning;
  isPickup: false;
}

interface PickupOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Pickup;
  isPickup: true;
  pickupLocation: {
    location: {
      latitude: number;
      longitude: number;
    };
    name: string;
    openingHours: string;
    pickupLocationCode: string;
    street: string;
    streetAdditionalInfo: string;
    city: string;
    postalCode: string;
  };
}

export type DeliveryOptionsOutput = DeliveryOutput | PickupOutput;

export type InternalOutput = {
  deliveryDate: string;
  /**
   * JSON encoded SelectedDeliveryMoment
   * @see SelectedDeliveryMoment
   */
  deliveryMoment: string;
  shipmentOptions?: ShipmentOptionName[];
};

export enum RelatedConfigOptionType {
  Allow = 'allow',
  Price = 'price',
  CutoffTime = 'cutoffTime',
}

export type RelatedConfigOption = {
  type: RelatedConfigOptionType;
  key: string;
};

export interface ConfigOption<T extends OptionType = OptionType> {
  key: string;
  parents?: string[];
  perCarrier?: boolean;
  related?: RelatedConfigOption[];
  type?: T;
  validators?: CustomValidator[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomValidator<T1 = any, T2 = T1> {
  error: string;

  /**
   * Parse the input value.
   */
  parse?(value: T1): T2;

  /**
   * Validate the input value.
   */
  validate(value: T1): boolean;
}
