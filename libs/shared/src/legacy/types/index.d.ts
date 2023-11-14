import {type Vue} from 'vue/types/vue';

/**
 * @deprecated
 * @deprecated
 */
declare namespace MyParcel {
  /** @deprecated */
  type Environment = 'dev' | 'staging' | 'acceptance' | 'prod';

  /** @deprecated */
  type CarrierName = 'postnl' | 'bpost' | 'dpd' | 'dhl' | 'ups' | 'dhlforyou' | 'dhlparcelconnect' | 'dhleuroplus';

  /** @deprecated */
  type CarrierID = 1 | 2 | 4 | 6 | 8 | 9 | 10 | 11;

  /** @deprecated */
  type CarrierNameOrId = CarrierName | CarrierID;

  /** @deprecated */
  type Platform = 'myparcel' | 'belgie' | 'flespakket';

  /** @deprecated */
  type CarrierIdentifier = CarrierName | `${CarrierName}:${number}`;

  /**
   * @deprecated
   * @see https://myparcelnl.github.io/api/#6_A_1
   */
  type PackageType = 'package' | 'mailbox' | 'digital_stamp' | string;

  /**
   * @deprecated
   * @see https://myparcelnl.github.io/api/#6_A_2
   */
  type DeliveryType = 'morning' | 'standard' | 'evening' | 'pickup';

  /**
   * @deprecated
   * @see https://myparcelnl.github.io/api/#6_A_3
   */
  type ShipmentOptionName =
    | 'cooled_delivery'
    | 'large_format'
    | 'only_recipient'
    | 'signature'
    | 'return'
    | 'same_day_delivery';
}

/** @deprecated */

declare namespace MyParcelDeliveryOptions {
  /** @deprecated */
  type DeliveryType = MyParcel.DeliveryType | 'sameDay';

  /**
   * @deprecated
   * Configuration object supplied by the platform.
   */
  /** @deprecated */
  interface Configuration {
    address: Address;
    config: Config;
    strings: Strings;
  }

  /**
   * @deprecated
   * Address object from the external platform.
   */
  /** @deprecated */
  interface Address {
    cc: string;
    city?: string;
    number: string | number;
    postalCode: string;
  }

  /**
   * @deprecated
   * Strings object from the external platform.
   */
  /** @deprecated */
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
     * @deprecated
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
   * @deprecated
   * Response from /delivery_options
   */
  /** @deprecated */
  interface DeliveryOption {
    date: Timestamp;
    possibilities: DeliveryPossibility[];
  }

  /**
   * @deprecated
   * Response from /pickup_locations
   */
  /** @deprecated */
  interface PickupLocation {
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

  /** @deprecated */
  interface FilterableOption {
    allow: boolean;
    items: string[];
  }

  /**
   * @deprecated
   * Configuration object from the external platform.
   */
  /** @deprecated */
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

  /** @deprecated */
  type CarrierSettings = {
    [key in MyParcel.CarrierIdentifier]?: {
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
  };

  /** @deprecated */
  interface CarrierData {
    deliverCountries?: string[];
    deliveryEnabled?: boolean;
    id: MyParcel.CarrierID;
    identifier: MyParcel.CarrierIdentifier;
    image: string;
    label: string;
    name: MyParcel.CarrierName;
    pickupCountries?: string[];
    pickupEnabled?: boolean;
  }

  /** @deprecated */
  interface Timestamp {
    date: string;
    timezone: string;
    timezone_type: number;
  }

  /**
   * @deprecated
   * A start and end date object.
   */
  /** @deprecated */
  interface StartEndDate {
    end: Timestamp;
    start: Timestamp;
  }

  /** @deprecated */
  interface EnumSchema<Type> {
    enum: Type[];
    type: Type extends boolean ? 'boolean' : string;
  }

  /** @deprecated */
  interface ShipmentOption {
    name: MyParcel.ShipmentOptionName;
    schema: EnumSchema<boolean>;
  }

  /** @deprecated */
  interface DeliveryTimeFrame<Type = 'start' | 'end'> {
    date_time: Timestamp;
    type: Type;
  }

  /** @deprecated */
  interface DeliveryPossibility {
    collect_date?: any;
    delivery_time_frames: [DeliveryTimeFrame<'start'>, DeliveryTimeFrame<'end'>];
    package_type: string;
    shipment_options: ShipmentOption[];
    type: MyParcel.DeliveryType;
  }

  /** @deprecated */
  interface PickupPossibility {
    delivery_type_id: number;
    delivery_type_name: MyParcel.DeliveryType;
    moment: {
      start: Timestamp;
    };
  }

  /** @deprecated */
  interface FormConfig {
    enabled?: string;
    label?: string;
    name: string;
    options?: FormConfig[];
    price?: string;
    selected?: boolean;
  }

  /** @deprecated */
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

  /** @deprecated */
  interface FormEntryChoice {
    disabled?: boolean;
    label?: string;
    name: string;
    plainLabel?: string;
    price?: number;
    selected?: boolean;
  }

  /** @deprecated */
  interface FormEntryDependency {
    name: string;
    parent: string;
    transform?: Function;
  }

  /** @deprecated */
  interface MapTileLayerData {
    attribution: string;
    maxZoom?: number;
    token?: string;
    url: string;
  }

  /** @deprecated */
  type CarrierDeliveryDependencies = Record<MyParcel.CarrierName, DeliveryDependencies>;

  /** @deprecated */
  interface DeliveryDependencies {
    // ISO date string
    deliveryDate: Record<
      string,
      {
        deliveryMoment: DeliveryDependencyMoments;
      }
    >;
  }

  /** @deprecated */
  type DeliveryDependencyMoments = Record<DeliveryType, DeliveryDependencyMoment>;

  /** @deprecated */
  interface DeliveryDependencyMoment {
    moments: {
      start: string;
      end: string;
    };
    shipmentOptions: Record<MyParcel.ShipmentOptionName, EnumSchema<boolean>>;
  }

  /** @deprecated */
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

/** @deprecated */
declare module 'MyParcel' {
  export = MyParcel;
}

/** @deprecated */
declare module 'MyParcelDeliveryOptions' {
  export = MyParcelDeliveryOptions;
}
