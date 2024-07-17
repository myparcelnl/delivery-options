export enum DeprecatedCarrierSetting {
  /** @deprecated use ShowDeliveryDate instead */
  AllowShowDeliveryDate = 'allowShowDeliveryDate',

  /** @deprecated use DropOffDays instead */
  FridayCutoffTime = 'fridayCutoffTime',
  /** @deprecated use DropOffDays instead */
  SaturdayCutoffTime = 'saturdayCutoffTime',
}

export enum CarrierSetting {
  AllowDeliveryOptions = 'allowDeliveryOptions',
  AllowEveningDelivery = 'allowEveningDelivery',
  AllowMondayDelivery = 'allowMondayDelivery',
  AllowMorningDelivery = 'allowMorningDelivery',
  AllowOnlyRecipient = 'allowOnlyRecipient',
  AllowPickupLocations = 'allowPickupLocations',
  AllowSameDayDelivery = 'allowSameDayDelivery',
  AllowSaturdayDelivery = 'allowSaturdayDelivery',
  AllowSignature = 'allowSignature',
  AllowStandardDelivery = 'allowStandardDelivery',
  CutoffTime = 'cutoffTime',
  CutoffTimeSameDay = 'cutoffTimeSameDay',
  DeliveryDaysWindow = 'deliveryDaysWindow',
  DropOffDays = 'dropOffDays',
  DropOffDelay = 'dropOffDelay',
  PackageType = 'packageType',
  PriceEveningDelivery = 'priceEveningDelivery',
  PriceMondayDelivery = 'priceMondayDelivery',
  PriceMorningDelivery = 'priceMorningDelivery',
  PriceOnlyRecipient = 'priceOnlyRecipient',
  PricePackageTypeDigitalStamp = 'pricePackageTypeDigitalStamp',
  PricePackageTypeMailbox = 'pricePackageTypeMailbox',
  PricePackageTypePackageSmall = 'pricePackageTypePackageSmall',
  PricePickup = 'pricePickup',
  PriceSameDayDelivery = 'priceSameDayDelivery',
  PriceSaturdayDelivery = 'priceSaturdayDelivery',
  PriceSignature = 'priceSignature',
  PriceStandardDelivery = 'priceStandardDelivery',
}

export enum ConfigSetting {
  ApiBaseUrl = 'apiBaseUrl',
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

export enum AddressField {
  Country = 'cc',
  City = 'city',
  Number = 'number',
  PostalCode = 'postalCode',
  Street = 'street',
}

export enum OptionGroup {
  PackageTypes = 'packageTypes',
  Delivery = 'delivery',
  DeliveryMoments = 'deliveryMoments',
  ShipmentOptions = 'shipmentOptions',
  Feature = 'feature',
  DropOff = 'dropOff',
  Pickup = 'pickup',
  Strings = 'strings',
}

export enum OptionType {
  String = 'string',
  Boolean = 'boolean',
  Number = 'number',
  Currency = 'currency',
  Date = 'date',
  Time = 'time',
  Select = 'select',
  MultiSelect = 'multiSelect',
}

export enum SubscriptionType {
  Required = 1,
  Never = 0,
  Optional = -1,
}

export enum RelatedConfigOptionType {
  Allow = 'allow',
  Price = 'price',
  CutoffTime = 'cutoffTime',
}

export enum PickupLocationType {
  Default = 'default',
  Locker = 'locker',
}

export enum ElementEvent {
  Keydown = 'keydown',
  Click = 'click',
}

export enum CustomDeliveryType {
  SameDay = 'same_day',
  Monday = 'monday',
  Saturday = 'saturday',
}
