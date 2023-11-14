import {type DeliveryOptionsAddress} from '@myparcel-do/shared';
import {type CarrierName, type PackageTypeName, type PlatformName} from '@myparcel/constants';
import {type CARRIERS_MYPARCELNL, type CARRIERS_SENDMYPARCEL} from '../data/carriers';

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

export type CarriersByPlatform<Platform extends PlatformName> = Platform extends PlatformName.MyParcel
  ? typeof CARRIERS_MYPARCELNL
  : Platform extends PlatformName.SendMyParcel
  ? typeof CARRIERS_SENDMYPARCEL
  : CarrierName[];

export type CarrierIdentifier<Platform extends PlatformName = PlatformName> = CarriersByPlatform<Platform>[number];

interface BaseCarrierSettings {
  allowEveningDelivery?: boolean | FilterableOption;
  allowMorningDelivery?: boolean | FilterableOption;
  allowOnlyRecipient?: boolean;
  allowShowDeliveryDate?: boolean;
  allowSignature?: boolean;
  priceEveningDelivery?: number;
  priceMorningDelivery?: number;
  priceOnlyRecipient?: number;
  pricePickup?: number;
  priceSameDayDelivery?: number;
  priceSignature?: number;
  priceStandardDelivery?: number;
}

interface BeCarrierSettings extends BaseCarrierSettings {
  allowMondayDelivery?: boolean;
}

interface NlCarrierSettings extends BaseCarrierSettings {
  allowSaturdayDelivery?: boolean;
}

export type CarrierSettings<Platform extends PlatformName = PlatformName> = Platform extends PlatformName.MyParcel
  ? NlCarrierSettings
  : Platform extends PlatformName.SendMyParcel
  ? BeCarrierSettings
  : BaseCarrierSettings;

type BaseConfig<Platform extends PlatformName = PlatformName> = CarrierSettings<Platform> & {
  allowShowDeliveryDate?: boolean;
  apiBaseUrl?: string;
  carrierSettings?: Record<CarrierIdentifier<Platform>, CarrierSettings<Platform>>;
  currency?: string;
  cutoffTime?: string;
  deliveryDaysWindow?: string | number;
  dropOffDays?: string;
  dropOffDelay?: string | number;
  locale?: string;
  packageType?: PackageTypeName;
  pickupLocationsDefaultView?: 'map' | 'list';

  /**
   * JSON string or object.
   */
  pickupLocationsMapTileLayerData?: string | MapTileLayerData;
  pickupShowDistance?: boolean;
};

interface MyParcelNlConfig extends BaseConfig<PlatformName.MyParcel> {
  platform: PlatformName.MyParcel;
}

interface SendMyParcelConfig extends BaseConfig<PlatformName.SendMyParcel> {
  platform: PlatformName.SendMyParcel;
}

export type DeliveryOptionsConfig = MyParcelNlConfig | SendMyParcelConfig;

export interface DeliveryOptionsConfiguration {
  address: DeliveryOptionsAddress;
  config: DeliveryOptionsConfig;
  strings: DeliveryOptionsStrings;
}
