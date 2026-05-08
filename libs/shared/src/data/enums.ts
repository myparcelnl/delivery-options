export enum CarrierSetting {
  AllowEveningDelivery = 'allowEveningDelivery',
  AllowMondayDelivery = 'allowMondayDelivery',
  AllowMorningDelivery = 'allowMorningDelivery',
  AllowOnlyRecipient = 'allowOnlyRecipient',
  AllowPickupLocations = 'allowPickupLocations',
  AllowSameDayDelivery = 'allowSameDayDelivery',
  AllowSaturdayDelivery = 'allowSaturdayDelivery',
  AllowSignature = 'allowSignature',
  AllowStandardDelivery = 'allowStandardDelivery',
  AllowExpressDelivery = 'allowExpressDelivery',
  AllowPriorityDelivery = 'allowPriorityDelivery',
  Collect = 'collect',
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
  PricePriorityDelivery = 'pricePriorityDelivery',
  PricePackageTypeDigitalStamp = 'pricePackageTypeDigitalStamp',
  PricePackageTypeMailbox = 'pricePackageTypeMailbox',
  PricePackageTypePackageSmall = 'pricePackageTypePackageSmall',
  PricePickup = 'pricePickup',
  PriceSameDayDelivery = 'priceSameDayDelivery',
  PriceExpressDelivery = 'priceExpressDelivery',
  PriceSaturdayDelivery = 'priceSaturdayDelivery',
  PriceSignature = 'priceSignature',
  PriceStandardDelivery = 'priceStandardDelivery',
}

export enum ConfigSetting {
  ApiBaseUrl = 'apiBaseUrl',
  ProxyCapabilities = 'proxyCapabilities',
  ApiKey = 'apiKey',
  Currency = 'currency',
  Locale = 'locale',
  PickupLocationsDefaultView = 'pickupLocationsDefaultView',
  AllowPickupLocationsViewSelection = 'allowPickupLocationsViewSelection',
  PickupLocationsMapTileLayerData = 'pickupLocationsMapTileLayerData',
  PickupMapAllowLoadMore = 'pickupMapAllowLoadMore',
  PickupShowDistance = 'pickupShowDistance',
  Platform = 'platform',
  ShowPriceSurcharge = 'showPriceSurcharge',
  ShowPrices = 'showPrices',
  ShowPriceZeroAsFree = 'showPriceZeroAsFree',
  ClosedDays = 'closedDays',
  ExcludeParcelLockers = 'excludeParcelLockers',
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
  ShipmentOptionsPerPackageType = 'shipmentOptionsPerPackageType',
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
