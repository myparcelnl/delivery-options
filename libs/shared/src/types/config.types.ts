import {type Component} from 'vue';
import {type RecursiveRequired} from '@myparcel/ts-utils';
import {type CarrierName, type DeliveryTypeName, type PackageTypeName, type PlatformName} from '@myparcel/constants';
import {type ComponentName, type OptionType, type PickupLocationsView} from '../constants';
import {type CustomValidator} from './validator.types';
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

export type TimestampString = `${number}:${number}`;

export type Price = number | null;

interface BaseCarrierSettings {
  allowDeliveryOptions?: boolean | FilterableOption;
  allowEveningDelivery?: boolean | FilterableOption;
  allowMorningDelivery?: boolean | FilterableOption;
  allowOnlyRecipient?: boolean;
  allowPackageTypeDigitalStamp?: boolean;
  allowPackageTypeMailbox?: boolean;
  allowPickupLocations?: boolean | FilterableOption;
  allowSameDayDelivery?: boolean;
  /** @deprecated use ShowDeliveryDate instead */
  allowShowDeliveryDate?: boolean;
  allowSignature?: boolean;
  cutoffTime?: TimestampString;
  cutoffTimeSameDay?: TimestampString;
  deliveryDaysWindow?: number;
  dropOffDays?: number[];
  dropOffDelay?: number;
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
  showDeliveryDate?: boolean;
}

interface BeCarrierSettings extends BaseCarrierSettings {
  allowSaturdayDelivery?: boolean;
  fridayCutoffTime?: TimestampString;
}

interface NlCarrierSettings extends BaseCarrierSettings {
  allowMondayDelivery?: boolean;
  saturdayCutoffTime?: TimestampString;
}

export type CarrierSettings<Platform extends PlatformName = PlatformName> = Platform extends PlatformName.MyParcel
  ? NlCarrierSettings
  : Platform extends PlatformName.SendMyParcel
  ? BeCarrierSettings
  : NlCarrierSettings | BeCarrierSettings;

type BaseConfig<Platform extends PlatformName = PlatformName> = CarrierSettings<Platform> & {
  // allowShowDeliveryDate?: boolean;
  // cutoffTime?: string;
  // deliveryDaysWindow?: string | number;
  // dropOffDays?: string;
  // dropOffDelay?: string | number;
  // packageType?: PackageTypeName;

  apiBaseUrl?: string;
  carrierSettings?: Record<CarrierIdentifier, CarrierSettings<Platform>>;
  currency?: string;
  locale?: string;
  pickupLocationsDefaultView?: PickupLocationsView;
  pickupLocationsMapTileLayerData?: string | MapTileLayerData;
  pickupShowDistance?: boolean;
  platform?: PlatformName;
  showDeliveryDate?: boolean;
  showPriceSurcharge?: boolean;
  showPrices?: boolean;
};

export type DeliveryOptionsConfig<P extends SupportedPlatformName = SupportedPlatformName> = BaseConfig<P> & {
  platform: P;
};

export interface DeliveryOptionsConfiguration<P extends SupportedPlatformName = SupportedPlatformName> {
  address: DeliveryOptionsAddress;
  config: DeliveryOptionsConfig<P>;
  initial?: Partial<DeliveryOptionsOutput>;
  strings: DeliveryOptionsStrings;
}

export interface InputDeliveryOptionsConfiguration<P extends SupportedPlatformName = SupportedPlatformName> {
  address: DeliveryOptionsAddress;
  components: Partial<Record<ComponentName, Component>>;
  config: DeliveryOptionsConfig<P>;
  initial?: Partial<DeliveryOptionsOutput>;
  strings?: DeliveryOptionsStrings;
}

export interface ResolvedDeliveryOptionsConfiguration<P extends SupportedPlatformName = SupportedPlatformName> {
  address: RecursiveRequired<DeliveryOptionsAddress>;
  config: RecursiveRequired<DeliveryOptionsConfig<P>>;
  strings: RecursiveRequired<DeliveryOptionsStrings>;
}

interface BaseOutput {
  carrier: CarrierIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  isPickup: boolean;
  packageType: PackageTypeName;
  shipmentOptions: Record<string, boolean>;
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
  deliveryMoment: {
    carrier: CarrierIdentifier;
    date: string;
    deliveryType: DeliveryTypeName;
    packageType: PackageTypeName;
  };
};

export interface ConfigOption<T extends OptionType = OptionType> {
  hasCarrierToggle?: boolean;
  key: string;
  parents?: string[];
  type?: T;
  validators?: CustomValidator[];
}
