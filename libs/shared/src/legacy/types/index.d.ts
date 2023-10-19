import {Vue} from 'vue/types/vue';

declare namespace MyParcel {
  type Environment = 'dev' | 'staging' | 'acceptance' | 'prod'

  type CarrierName = 'postnl' | 'bpost' | 'dpd' | 'dhl' | 'ups' | 'dhlforyou' | 'dhlparcelconnect' | 'dhleuroplus'
  type CarrierID = 1 | 2 | 4 | 6 | 8 | 9 | 10 | 11
  type CarrierNameOrId = CarrierName | CarrierID
  type Platform = 'myparcel' | 'belgie' | 'flespakket'

  type CarrierIdentifier = CarrierName | `${CarrierName}:${number}`

  /**
   * @see https://myparcelnl.github.io/api/#6_A_1
   */
  type PackageType = 'package' | 'mailbox' | 'digital_stamp' | string

  /**
   * @see https://myparcelnl.github.io/api/#6_A_2
   */
  type DeliveryType = 'morning' | 'standard' | 'evening' | 'pickup'

  /**
   * @see https://myparcelnl.github.io/api/#6_A_3
   */
  type ShipmentOptionName =
    'cooled_delivery'
    | 'large_format'
    | 'only_recipient'
    | 'signature'
    | 'return'
    | 'same_day_delivery'
}

declare namespace MyParcelDeliveryOptions {
  type DeliveryType = MyParcel.DeliveryType | 'sameDay';

  /**
   * Configuration object supplied by the platform.
   */
  interface Configuration {
    address: Address;
    config: Config;
    strings: Strings;
  }

  /**
   * Address object from the external platform.
   */
  interface Address {
    cc: string;
    city?: string;
    number: string | number;
    postalCode: string;
  }

  /**
   * Strings object from the external platform.
   */
  interface Strings {
    addressNotFound?: string;
    // BE only
    beDeliveryStandardTitle?: string;
    beDeliveryTitle?: string;
    cc?: string;
    city?: string;
    closed?: string;
    deliveryEveningTitle?: string;
    deliveryMorningTitle?: string;
    deliveryStandardTitle?: string;
    deliveryTitle?: string;
    /**
     * @see src/config/errorConfig.js
     */
    error3212?: string;
    error3224?: string;
    error3505?: string;
    error3506?: string;
    error3728?: string;
    free?: string;
    from?: string;
    headerDeliveryOptions?: string;
    loadMore?: string;
    // NL only
    mondayDeliveryTitle?: string;
    number?: string;
    onlyRecipientTitle?: string;
    openingHours?: string;
    options?: string;
    packageTypeDigitalStamp?: string;
    packageTypeMailbox?: string;
    pickUp?: string;
    pickUpFrom?: string;
    pickupLocationsListButton?: string;
    pickupLocationsMapButton?: string;
    pickupTitle?: string;
    postalCode?: string;
    retry?: string;
    saturdayDeliveryTitle?: string;
    signatureTitle?: string;
    street?: string;
    wrongPostalCodeCity?: string;
    wrongnumberPostalCode?: string;
  }

  /**
   * Response from /delivery_options
   */
  interface DeliveryOption {
    date: Timestamp;
    possibilities: DeliveryPossibility[];
  }

  /**
   * Response from /pickup_locations
   */
  interface PickupLocation {
    address: {
      cc: string
      city: string
      number: string
      postal_code: string
      street: string
    };
    location: {
      distance: string
      latitude: string
      location_code: string
      location_name: string
      longitude: string
      phone_number: string
      retail_network_id: string
      opening_hours: {
        monday: StartEndDate[]
        tuesday: StartEndDate[]
        wednesday: StartEndDate[]
        thursday: StartEndDate[]
        friday: StartEndDate[]
        saturday: StartEndDate[]
        sunday: StartEndDate[]
      }
    };
    possibilities: PickupPossibility[];
  }

  interface FilterableOption {
    allow: boolean,
    items: string[]
  }

  /**
   * Configuration object from the external platform.
   */
  interface Config {
    allowDeliveryOptions?: boolean | FilterableOption;
    allowPickupLocations?: boolean | FilterableOption;
    // Feature toggles
    allowRetry?: boolean;
    allowShowDeliveryDate?: boolean;
    apiBaseUrl?: string;
    carrierSettings?: CarrierSettings;
    currency?: string;
    cutoffTime?: string;
    deliveryDaysWindow?: string | number;
    dropOffDays?: string;
    dropOffDelay?: string | number;
    locale?: string;
    // NL only
    mondayCutoffTime?: string;
    packageType?: MyParcel.PackageType;
    pickupLocationsDefaultView?: 'map' | 'list';
    // Can be JSON string or object.
    pickupLocationsMapTileLayerData?: string | MapTileLayerData;
    pickupShowDistance?: boolean;
    platform?: MyParcel.Platform;
    // BE only
    saturdayCutoffTime?: string;
  }

  type CarrierSettings = {
    [key in MyParcel.CarrierIdentifier]?: {
      allowEveningDelivery?: boolean
      allowMorningDelivery?: boolean
      allowOnlyRecipient?: boolean
      allowSignature?: boolean
      allowShowDeliveryDate?: boolean

      // NL only
      allowSaturdayDelivery?: boolean

      // BE only
      allowMondayDelivery?: boolean

      priceEveningDelivery?: number
      priceMorningDelivery?: number
      priceOnlyRecipient?: number
      pricePickup?: number
      priceSameDayDelivery?: number
      priceSignature?: number
      priceStandardDelivery?: number
    }
  }

  interface CarrierData {
    deliverCountries?: String[];
    deliveryEnabled?: boolean;
    id: MyParcel.CarrierID;
    identifier: MyParcel.CarrierIdentifier;
    image: string;
    label: string;
    name: MyParcel.CarrierName;
    pickupCountries?: String[];
    pickupEnabled?: boolean;
  }

  interface Timestamp {
    date: string;
    timezone: string;
    timezone_type: number;
  }

  /**
   * A start and end date object.
   */
  interface StartEndDate {
    end: Timestamp;
    start: Timestamp;
  }

  interface EnumSchema<Type> {
    enum: Type[];
    type: Type extends boolean ? 'boolean' : string;
  }

  interface ShipmentOption {
    name: MyParcel.ShipmentOptionName;
    schema: EnumSchema<boolean>;
  }

  interface DeliveryTimeFrame<Type = 'start' | 'end'> {
    date_time: Timestamp;
    type: Type;
  }

  interface DeliveryPossibility {
    collect_date?: any;
    delivery_time_frames: [
      DeliveryTimeFrame<'start'>,
      DeliveryTimeFrame<'end'>
    ];
    package_type: string;
    shipment_options: ShipmentOption[];
    type: MyParcel.DeliveryType;
  }

  interface PickupPossibility {
    delivery_type_id: number;
    delivery_type_name: MyParcel.DeliveryType;
    moment: {
      start: Timestamp
    };
  }

  interface FormConfig {
    enabled?: string;
    label?: string;
    name: string;
    options?: FormConfig[];
    price?: string;
    selected?: boolean;
  }

  interface FormEntry {
    choices?: FormEntryChoice[];
    component?: Vue;
    dependency?: FormEntryDependency;
    hidden?: boolean;
    loop?: boolean;
    name: string;
    pagination?: number;
    type?: 'radio' | 'select' | 'checkbox' | 'text' | string;
  }

  interface FormEntryChoice {
    disabled?: boolean;
    label?: string;
    name: string;
    plainLabel?: string;
    price?: number;
    selected?: boolean;
  }

  interface FormEntryDependency {
    name: string,
    parent: string,
    transform?: Function,
  }

  interface MapTileLayerData {
    attribution: string;
    maxZoom?: number;
    token?: string;
    url: string;
  }

  type CarrierDeliveryDependencies = Record<MyParcel.CarrierName, DeliveryDependencies>

  interface DeliveryDependencies {
    // ISO date string
    deliveryDate: Record<string, {
      deliveryMoment: DeliveryDependencyMoments
    }>;
  }

  type DeliveryDependencyMoments = Record<DeliveryType, DeliveryDependencyMoment>

  interface DeliveryDependencyMoment {
    moments: {
      start: string
      end: string
    },
    shipmentOptions: Record<MyParcel.ShipmentOptionName, EnumSchema<boolean>>
  }

  interface DeliveryOptionsRequestParameters {
    carrier: MyParcel.CarrierIdentifier;
    cc: string;
    cutoff_time?: string;
    deliverydays_window?: number;
    dropoff_days?: string;
    dropoff_delay?: number;
    include?: 'shipment_options';
    monday_delivery?: boolean;
    number: number;
    package_type?: MyParcel.PackageType;
    platform: MyParcel.Platform;
    postal_code: string;
    saturday_delivery?: boolean;
  }
}

declare module 'MyParcel' {
  export = MyParcel
}

declare module 'MyParcelDeliveryOptions' {
  export = MyParcelDeliveryOptions
}
