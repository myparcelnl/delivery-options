import {type MakeOptional} from '@myparcel/ts-utils';
import {type CarrierName} from '@myparcel/constants';
import {
  type CarrierSetting,
  type ConfigSetting,
  type OptionType,
  type PickupLocationsView,
  type RelatedConfigOptionType,
} from '../data';
import {type CustomValidator} from './validation.types';
import {type SupportedPackageTypeName, type SupportedPlatformName} from './platform.types';
import {type DeliveryOptionsOutput} from './output.types';
import {type SelectOption} from './options.types';
import {type MakeRequired} from './common.types';
import {type DeliveryOptionsAddress} from './address.types';

export interface MapTileLayerData {
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

export type DropOffEntryObject = {
  weekday: Weekday | `${Weekday}`;
  cutoffTimeSameDay?: string;
  cutoffTime?: string;
};

export type DropOffEntry = Weekday | DropOffEntryObject;

export type DeliveryOptionsStrings = Record<string, string>;

export type CarrierIdentifier = `${CarrierName}:${number}` | CarrierName;

export type TimestampString = `${number}:${number}` | string;

export type Price = number | null;

export interface CarrierSettings extends Partial<Record<CarrierSettingsKey, unknown>> {
  allowDeliveryOptions?: boolean | FilterableOption;
  allowEveningDelivery?: boolean | FilterableOption;
  allowExpressDelivery?: boolean | FilterableOption;
  allowMondayDelivery?: boolean;
  allowMorningDelivery?: boolean | FilterableOption;
  allowOnlyRecipient?: boolean;
  allowPickupLocations?: boolean | FilterableOption;
  allowSameDayDelivery?: boolean;
  allowSaturdayDelivery?: boolean;
  allowSignature?: boolean;
  allowStandardDelivery?: boolean | FilterableOption;
  cutoffTime?: TimestampString;
  cutoffTimeSameDay?: TimestampString;
  deliveryDaysWindow?: number;
  dropOffDays?: DropOffEntryObject[];
  dropOffDelay?: number;
  packageType?: SupportedPackageTypeName;
  priceEveningDelivery?: Price;
  priceExpressDelivery?: Price;
  priceMondayDelivery?: Price;
  priceMorningDelivery?: Price;
  priceOnlyRecipient?: Price;
  pricePackageTypeDigitalStamp?: Price;
  pricePackageTypeMailbox?: Price;
  pricePackageTypePackageSmall?: Price;
  pricePickup?: Price;
  priceSameDayDelivery?: Price;
  priceSaturdayDelivery?: Price;
  priceSignature?: Price;
  priceStandardDelivery?: Price;
}

export interface InputCarrierSettings extends Omit<CarrierSettings, 'dropOffDays'>, DeprecatedConfigOptions {
  dropOffDays?: DropOffEntry[] | string;
}

export type InputCarrierSettingsObject = Partial<Record<CarrierIdentifier, InputCarrierSettings>>;

export type CarrierSettingsObject = Partial<Record<CarrierIdentifier, CarrierSettings>>;

export interface DeliveryOptionsConfig extends Partial<Record<ConfigSetting, unknown>>, CarrierSettings {
  allowPickupLocationsViewSelection: boolean;
  apiBaseUrl: string;
  carrierSettings: CarrierSettingsObject;
  /**
   * Currency. Defaults to format of the browser.
   */
  currency: string | undefined;
  /**
   * Locale. Defaults to the language of the browser.
   */
  locale: string | undefined;
  pickupLocationsDefaultView: PickupLocationsView;
  pickupLocationsMapTileLayerData: string | MapTileLayerData;
  pickupShowDistance: boolean;
  platform: SupportedPlatformName;
  showDeliveryDate: boolean;
  showPriceSurcharge: boolean;
  showPriceZeroAsFree: boolean;
  showPrices: boolean;
}

export type ResolvedDeliveryOptionsConfig = MakeRequired<
  DeliveryOptionsConfig,
  | ConfigSetting.ApiBaseUrl
  | ConfigSetting.Currency
  | ConfigSetting.Locale
  | ConfigSetting.PickupLocationsDefaultView
  | ConfigSetting.AllowPickupLocationsViewSelection
  | ConfigSetting.PickupLocationsMapTileLayerData
  | ConfigSetting.PickupShowDistance
  | ConfigSetting.Platform
  | ConfigSetting.ShowDeliveryDate
  | ConfigSetting.ShowPriceSurcharge
  | ConfigSetting.ShowPrices
  | ConfigSetting.ShowPriceZeroAsFree
  | CarrierSetting.AllowDeliveryOptions
  | CarrierSetting.AllowEveningDelivery
  | CarrierSetting.AllowMondayDelivery
  | CarrierSetting.AllowMorningDelivery
  | CarrierSetting.AllowOnlyRecipient
  | CarrierSetting.AllowPickupLocations
  | CarrierSetting.AllowSameDayDelivery
  | CarrierSetting.AllowSignature
  | CarrierSetting.AllowStandardDelivery
  | CarrierSetting.DeliveryDaysWindow
  | CarrierSetting.DropOffDays
  | CarrierSetting.DropOffDelay
  | CarrierSetting.PackageType
>;

export interface DeprecatedConfigOptions {
  /** @deprecated use ShowDeliveryDate instead */
  allowShowDeliveryDate?: boolean;
  /** @deprecated use dropOffDays instead */
  fridayCutoffTime?: TimestampString;
  /** @deprecated use dropOffDays instead */
  saturdayCutoffTime?: TimestampString;
}

/**
 * Includes deprecated options which will be filtered out.
 */
export type InputDeliveryOptionsConfig = {
  dropOffDays?: DropOffEntry[] | string;
  carrierSettings?: InputCarrierSettingsObject;
} & Omit<MakeOptional<DeliveryOptionsConfig, keyof DeliveryOptionsConfig>, 'carrierSettings' | 'dropOffDays'> &
  DeprecatedConfigOptions;

export interface DeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  config: DeliveryOptionsConfig;
  initial: Partial<DeliveryOptionsOutput>;
  strings: DeliveryOptionsStrings;
}

export interface InputDeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  // components: Partial<Record<ComponentName, Component>>;
  config: InputDeliveryOptionsConfig;
  initial?: Partial<DeliveryOptionsOutput>;
  strings?: DeliveryOptionsStrings;
}

export type RelatedConfigOption = {
  type: RelatedConfigOptionType;
  key: string;
};

export interface BaseConfigOption<T extends OptionType = OptionType> {
  key: ConfigKey | string;
  parents?: ConfigKey[];
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

export type ResolvedConfigOption<O extends ConfigKey | ConfigOption> = O extends ConfigOption ? O : ConfigOption;

export type CarrierSettingsKey = CarrierSetting;

export type ConfigKey = ConfigSetting | CarrierSettingsKey;
