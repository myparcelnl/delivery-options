import {type CarrierName, type DeliveryTypeName, type PackageTypeName, type PlatformName} from '@myparcel/constants';
import {type CARRIERS_MYPARCELNL, type CARRIERS_SENDMYPARCEL} from '../data';
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
  initial?: DeliveryOptionsOutput;
  strings: DeliveryOptionsStrings;
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
