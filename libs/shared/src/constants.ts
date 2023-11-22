import {PlatformName} from '@myparcel/constants';

export enum SubscriptionType {
  Required = 1,
  Never = 0,
  Optional = -1,
}

export const DEFAULT_PLATFORM = PlatformName.MyParcel;

export const FORM_NAME_DELIVERY_OPTIONS = 'deliveryOptions';

export enum CarrierSetting {
  AllowDeliveryOptions = 'allowDeliveryOptions',
  AllowEveningDelivery = 'allowEveningDelivery',
  AllowMondayDelivery = 'allowMondayDelivery',
  AllowMorningDelivery = 'allowMorningDelivery',
  AllowOnlyRecipient = 'allowOnlyRecipient',
  AllowPackageTypeDigitalStamp = 'allowPackageTypeDigitalStamp',
  AllowPackageTypeMailbox = 'allowPackageTypeMailbox',
  AllowPickupLocations = 'allowPickupLocations',
  AllowSameDayDelivery = 'allowSameDayDelivery',
  AllowSaturdayDelivery = 'allowSaturdayDelivery',
  /** @deprecated use ShowDeliveryDate instead */
  AllowShowDeliveryDate = 'allowShowDeliveryDate',
  AllowSignature = 'allowSignature',
  CutoffTime = 'cutoffTime',
  CutoffTimeSameDay = 'cutoffTimeSameDay',
  DeliveryDaysWindow = 'deliveryDaysWindow',
  DropOffDays = 'dropOffDays',
  DropOffDelay = 'dropOffDelay',
  FridayCutoffTime = 'fridayCutoffTime',
  PackageType = 'packageType',
  PriceEveningDelivery = 'priceEveningDelivery',
  PriceMondayDelivery = 'priceMondayDelivery',
  PriceMorningDelivery = 'priceMorningDelivery',
  PriceOnlyRecipient = 'priceOnlyRecipient',
  PricePackageTypeDigitalStamp = 'pricePackageTypeDigitalStamp',
  PricePackageTypeMailbox = 'pricePackageTypeMailbox',
  PricePickup = 'pricePickup',
  PriceSameDayDelivery = 'priceSameDayDelivery',
  PriceSaturdayDelivery = 'priceSaturdayDelivery',
  PriceSignature = 'priceSignature',
  PriceStandardDelivery = 'priceStandardDelivery',
  SaturdayCutoffTime = 'saturdayCutoffTime',
  ShowDeliveryDate = 'showDeliveryDate',
}

export enum ConfigSetting {
  ApiBaseUrl = 'apiBaseUrl',
  CarrierSettings = 'carrierSettings',
  Currency = 'currency',
  Locale = 'locale',
  PickupLocationsDefaultView = 'pickupLocationsDefaultView',
  PickupLocationsMapTileLayerData = 'pickupLocationsMapTileLayerData',
  PickupShowDistance = 'pickupShowDistance',
  Platform = 'platform',
  ShowDeliveryDate = 'showDeliveryDate',
  ShowPriceSurcharge = 'showPriceSurcharge',
  ShowPrices = 'showPrices',
}

export enum PickupLocationsView {
  Map = 'map',
  List = 'list',
}

export enum ComponentName {
  Button = 'Button',
  CheckboxGroup = 'CheckboxGroup',
  Checkbox = 'Checkbox',
  Radio = 'Radio',
  RadioGroup = 'RadioGroup',
  Select = 'Select',
  Text = 'Text',
}

export enum AddressField {
  Cc = 'cc',
  City = 'city',
  Number = 'number',
  PostalCode = 'postalCode',
  Street = 'street',
}

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

export const QUERY_KEY_CARRIERS = 'carriers';

export const QUERY_KEY_DELIVERY_OPTIONS = 'deliveryOptions';

export const QUERY_KEY_PICKUP_LOCATIONS = 'pickupLocations';
