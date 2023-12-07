import {type Component} from 'vue';
import {
  type CarrierName,
  type DeliveryTypeName,
  type PackageTypeName,
  type ShipmentOptionName,
} from '@myparcel/constants';
import {type ComponentName, type OptionType, type PickupLocationsView} from '../enums';
import {type AnyConfigKey, type SupportedPlatformName} from './platform.types';
import {type SelectOption} from './options.types';
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

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DropOffEntry {
  cutoffTime?: string;
  cutoffTimeSameDay?: string;
  day: `${Weekday}`;
}

export type DeliveryOptionsStrings = Record<string, string>;

export type CarrierIdentifier = `${CarrierName}:${number}` | CarrierName;

export type TimestampString = `${number}:${number}` | string;

export type Price = number | null;

export interface InputCarrierSettings extends CarrierSettings, DeprecatedConfigOptions {}

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
  allowSignature?: boolean;
  allowStandardDelivery?: boolean | FilterableOption;
  deliveryDaysWindow?: number;
  dropOffDelay?: number;
  dropOffPossibilities?: DropOffEntry[];
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

export type InputCarrierSettingsObject = Partial<Record<CarrierIdentifier, InputCarrierSettings>>;

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

export interface DeprecatedConfigOptions {
  /** @deprecated use ShowDeliveryDate instead */
  allowShowDeliveryDate?: boolean;
  /** @deprecated use dropOffPossibilities instead */
  cutoffTime?: TimestampString;
  /** @deprecated use dropOffPossibilities instead */
  cutoffTimeSameDay?: TimestampString;
  /** @deprecated use dropOffPossibilities instead */
  dropOffDays?: Weekday[] | string;
  /** @deprecated use dropOffPossibilities instead */
  fridayCutoffTime?: TimestampString;
  /** @deprecated use dropOffPossibilities instead */
  saturdayCutoffTime?: TimestampString;
}

/**
 * Includes deprecated options which will be filtered out.
 */
export interface InputDeliveryOptionsConfig extends DeliveryOptionsConfig, DeprecatedConfigOptions {
  carrierSettings?: InputCarrierSettingsObject;
}

export interface DeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  config: DeliveryOptionsConfig;
  initial: Partial<DeliveryOptionsOutput>;
  strings: DeliveryOptionsStrings;
}

export interface InputDeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  components: Partial<Record<ComponentName, Component>>;
  config: InputDeliveryOptionsConfig;
  initial?: Partial<DeliveryOptionsOutput>;
  strings?: DeliveryOptionsStrings;
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

export interface BaseConfigOption<T extends OptionType = OptionType> {
  key: AnyConfigKey | string;
  parents?: AnyConfigKey[];
  perCarrier?: boolean;
  related?: RelatedConfigOption[];
  type?: T;
  validators?: CustomValidator[];
}

export interface SelectConfigOption extends BaseConfigOption {
  options: SelectOption[];
  type: OptionType.Select | OptionType.MultiSelect;
}

export type ConfigOption = BaseConfigOption | SelectConfigOption;

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

export type ResolvedConfigOption<O extends AnyConfigKey | ConfigOption> = O extends ConfigOption ? O : ConfigOption;
