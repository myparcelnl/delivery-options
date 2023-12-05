export enum CarrierSetting {
  AllowDeliveryOptions = 'allowDeliveryOptions',
  AllowEveningDelivery = 'allowEveningDelivery',
  AllowMondayDelivery = 'allowMondayDelivery',
  AllowMorningDelivery = 'allowMorningDelivery',
  AllowOnlyRecipient = 'allowOnlyRecipient',
  AllowPackageTypeDigitalStamp = 'allowPackageTypeDigitalStamp',
  AllowPackageTypeMailbox = 'allowPackageTypeMailbox',
  AllowPackageTypePackage = 'allowPackageTypePackage',
  AllowPickupLocations = 'allowPickupLocations',
  AllowSameDayDelivery = 'allowSameDayDelivery',
  AllowSaturdayDelivery = 'allowSaturdayDelivery',
  /** @deprecated use ShowDeliveryDate instead */
  AllowShowDeliveryDate = 'allowShowDeliveryDate',
  AllowSignature = 'allowSignature',
  AllowStandardDelivery = 'allowStandardDelivery',
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
  Country = 'cc',
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
}

export enum SubscriptionType {
  Required = 1,
  Never = 0,
  Optional = -1,
}
