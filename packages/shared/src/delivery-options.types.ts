/* eslint-disable @typescript-eslint/naming-convention */
import {CarrierName, DeliveryTypeName, PackageTypeName, PlatformName, ShipmentOptionName} from '@myparcel/sdk';
import {Component} from 'vue';

export type DeliveryType = DeliveryTypeName | 'sameDay';

/**
 * Configuration object supplied by the platform.
 */
export interface Configuration {
  address: Address;
  strings: Strings;
  config: Config;
}

/**
 * Address object from the external platform.
 */
export interface Address {
  cc: string;
  number: string | number;
  postalCode: string;
  city?: string;
}

/**
 * Strings object from the external platform.
 */
export interface Strings {
  addressNotFound?: string;
  cc?: string;
  city?: string;
  closed?: string;
  deliveryEveningTitle?: string;
  deliveryMorningTitle?: string;
  deliveryStandardTitle?: string;
  deliveryTitle?: string;
  free?: string;
  from?: string;
  headerDeliveryOptions?: string;
  loadMore?: string;
  number?: string;
  onlyRecipientTitle?: string;
  openingHours?: string;
  options?: string;
  packageTypeDigitalStamp?: string;
  packageTypeMailbox?: string;
  pickUpFrom?: string;
  pickupLocationsListButton?: string;
  pickupLocationsMapButton?: string;
  pickupTitle?: string;
  postalCode?: string;
  retry?: string;
  signatureTitle?: string;

  // NL only
  mondayDeliveryTitle?: string;
  wrongNumberPostalCode?: string;

  // BE only
  beDeliveryStandardTitle?: string;
  beDeliveryTitle?: string;
  saturdayDeliveryTitle?: string;
  wrongPostalCodeCity?: string;
}

/**
 * Response from /delivery_options.
 */
export interface DeliveryOption {
  date: Timestamp;
  possibilities: DeliveryPossibility[];
}

/**
 * Response from /pickup_locations.
 */
export interface PickupLocation {
  address: {
    cc: string;
    city: string;
    number: string;
    postal_code: string;
    street: string;
  };
  location: {
    distance: string;
    latitude: string;
    location_code: string;
    location_name: string;
    longitude: string;
    phone_number: string;
    retail_network_id: string;
    opening_hours: {
      monday: StartEndDate[];
      tuesday: StartEndDate[];
      wednesday: StartEndDate[];
      thursday: StartEndDate[];
      friday: StartEndDate[];
      saturday: StartEndDate[];
      sunday: StartEndDate[];
    };
  };
  possibilities: PickupPossibility[];
}

export interface FilterableOption {
  allow: boolean;
  items: string[];
}

/**
 * Configuration object from the external platform.
 */
export type Config = SettingsPerCarrier & {
  apiBaseUrl?: string;
  locale?: string;
  platform?: PlatformName;
  currency?: string;

  allowDeliveryOptions?: boolean | FilterableOption;
  allowPickupLocations?: boolean | FilterableOption;

  packageType?: PackageTypeName;

  cutoffTime?: string;
  deliveryDaysWindow?: string | number;
  dropOffDays?: string | number[] | string[];
  dropOffDelay?: string | number;

  // NL only
  mondayCutoffTime?: string;

  // BE only
  saturdayCutoffTime?: string;

  carrierSettings?: CarrierSettings;

  // Feature toggles
  allowRetry?: boolean;
  pickupLocationsDefaultView?: 'map' | 'list';
  pickupShowDistance?: boolean;
  allowShowDeliveryDate?: boolean;

  // Can be JSON string or object.
  pickupLocationsMapTileLayerData?: string | MapTileLayerData;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SettingsPerCarrier = {
  allowEveningDelivery?: boolean;
  allowMorningDelivery?: boolean;
  allowOnlyRecipient?: boolean;
  allowSignature?: boolean;
  allowShowDeliveryDate?: boolean;

  // NL only
  allowSaturdayDelivery?: boolean;

  // BE only
  allowMondayDelivery?: boolean;

  priceEveningDelivery?: number;
  priceMorningDelivery?: number;
  priceOnlyRecipient?: number;
  pricePickup?: number;
  priceSameDayDelivery?: number;
  priceSignature?: number;
  priceStandardDelivery?: number;
};
export type CarrierSettings = {
  [key in CarrierName]?: SettingsPerCarrier
};

export interface CarrierData {
  id: number;
  name: CarrierName;
  label: string;
  image: string;
  deliveryEnabled?: boolean;
  pickupEnabled?: boolean;
  pickupCountries?: string[];
  deliverCountries?: string[];
}

export interface Timestamp {
  date: string;
  timezone: string;
  timezone_type: number;
}

/**
 * A start and end date object.
 */
export interface StartEndDate {
  start: Timestamp;
  end: Timestamp;
}

export interface EnumSchema<Type> {
  type: Type extends boolean ? 'boolean' : string;
  enum: Type[];
}

export interface ShipmentOption {
  name: ShipmentOptionName;
  schema: EnumSchema<boolean>;
}

export interface DeliveryTimeFrame<Type = 'start' | 'end'> {
  type: Type;
  date_time: Timestamp;
}

export interface DeliveryPossibility {
  collect_date?: any;
  delivery_time_frames: [
    DeliveryTimeFrame<'start'>,
    DeliveryTimeFrame<'end'>,
  ];
  package_type: string;
  shipment_options: ShipmentOption[];
  type: DeliveryTypeName;
}

export interface PickupPossibility {
  delivery_type_id: number;
  delivery_type_name: DeliveryTypeName;
  moment: {
    start: Timestamp;
  };
}

export interface FormConfig {
  name: string;
  enabled?: string;
  label?: string;
  price?: string;
  selected?: boolean;
  options?: FormConfig[];
}

export interface FormEntry {
  name: string;
  type?: 'radio' | 'select' | 'checkbox' | 'text' | string;
  choices?: FormEntryChoice[];
  component?: Component;
  dependency?: FormEntryDependency;
  loop?: boolean;
  pagination?: number;
  hidden?: boolean;
}

export interface FormEntryChoice {
  name: string;
  label?: string;
  plainLabel?: string;
  price?: number;
  disabled?: boolean;
  selected?: boolean;
}

export interface FormEntryDependency {
  name: string;
  parent: string;
  transform?: Function;
}

export interface MapTileLayerData {
  url: string;
  attribution: string;
  token?: string;
  maxZoom?: number;
}

export type CarrierDeliveryDependencies = Record<CarrierName, DeliveryDependencies>;

export interface DeliveryDependencies {
  // ISO date string
  deliveryDate: Record<string, { deliveryMoment: DeliveryDependencyMoments }>;
}

export type DeliveryDependencyMoments = Record<DeliveryType, DeliveryDependencyMoment>;

export interface DeliveryDependencyMoment {
  moments: {
    start: string;
    end: string;
  };
  shipmentOptions: Record<ShipmentOptionName, EnumSchema<boolean>>;
}

export interface DeliveryOptionsRequestParameters {
  carrier: string;
  cc: string;
  cutoff_time?: string;
  deliverydays_window?: number;
  dropoff_days?: string;
  dropoff_delay?: number;
  include?: 'shipment_options';
  monday_delivery?: boolean;
  number: number;
  package_type?: PackageTypeName;
  platform: PlatformName;
  postal_code: string;
  saturday_delivery?: boolean;
}
