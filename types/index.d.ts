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
  type ShipmentOptionName = 'cooled_delivery' | 'large_format' | 'only_recipient' | 'signature' | 'return' | 'same_day_delivery'
}

declare namespace MyParcelDeliveryOptions {
  type DeliveryType = MyParcel.DeliveryType | 'sameDay';

  /**
   * Configuration object supplied by the platform.
   */
  interface Configuration {
    address: Address
    strings: Strings
    config: Config
  }

  /**
   * Address object from the external platform.
   */
  interface Address {
    cc: string
    number: string | number
    postalCode: string
    city?: string
  }

  /**
   * Strings object from the external platform.
   */
  interface Strings {
    addressNotFound?: string
    cc?: string
    city?: string
    closed?: string
    deliveryEveningTitle?: string
    deliveryMorningTitle?: string
    deliveryStandardTitle?: string
    deliveryTitle?: string
    free?: string
    from?: string
    headerDeliveryOptions?: string
    loadMore?: string
    number?: string
    onlyRecipientTitle?: string
    openingHours?: string
    options?: string
    packageTypeDigitalStamp?: string
    packageTypeMailbox?: string
    pickUp?: string
    pickUpFrom?: string
    pickupLocationsListButton?: string
    pickupLocationsMapButton?: string
    pickupTitle?: string
    postalCode?: string
    retry?: string
    signatureTitle?: string
    street?: string

    // NL only
    mondayDeliveryTitle?: string
    wrongnumberPostalCode?: string

    // BE only
    beDeliveryStandardTitle?: string
    beDeliveryTitle?: string
    saturdayDeliveryTitle?: string
    wrongPostalCodeCity?: string

    /**
     * @see src/config/errorConfig.js
     */
    error3212?: string
    error3224?: string
    error3505?: string
    error3506?: string
    error3728?: string
  }

  /**
   * Response from /delivery_options
   */
  interface DeliveryOption {
    date: Timestamp
    possibilities: DeliveryPossibility[]
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
    }
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
    }
    possibilities: PickupPossibility[]
  }

  interface FilterableOption {
    allow: boolean,
    items: string[]
  }

  /**
   * Configuration object from the external platform.
   */
  interface Config {
    apiBaseUrl?: string
    locale?: string
    platform?: MyParcel.Platform
    currency?: string

    allowDeliveryOptions?: boolean | FilterableOption
    allowPickupLocations?: boolean | FilterableOption

    packageType?: MyParcel.PackageType

    cutoffTime?: string
    deliveryDaysWindow?: string | number
    dropOffDays?: string
    dropOffDelay?: string | number

    // NL only
    mondayCutoffTime?: string

    // BE only
    saturdayCutoffTime?: string

    carrierSettings?: CarrierSettings

    // Feature toggles
    allowRetry?: boolean
    pickupLocationsDefaultView?: 'map' | 'list'
    pickupShowDistance?: boolean
    allowShowDeliveryDate?: boolean

    // Can be JSON string or object.
    pickupLocationsMapTileLayerData?: string | MapTileLayerData
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
    id: MyParcel.CarrierID
    identifier: MyParcel.CarrierIdentifier
    name: MyParcel.CarrierName
    label: string
    image: string
    deliveryEnabled?: boolean
    pickupEnabled?: boolean
    pickupCountries?: String[]
    deliverCountries?: String[]
  }

  interface Timestamp {
    date: string
    timezone: string
    timezone_type: number
  }

  /**
   * A start and end date object.
   */
  interface StartEndDate {
    start: Timestamp
    end: Timestamp
  }

  interface EnumSchema<Type> {
    type: Type extends boolean ? 'boolean' : string;
    enum: Type[];
  }

  interface ShipmentOption {
    name: MyParcel.ShipmentOptionName
    schema: EnumSchema<boolean>
  }

  interface DeliveryTimeFrame<Type = 'start' | 'end'> {
    type: Type
    date_time: Timestamp
  }

  interface DeliveryPossibility {
    collect_date?: any
    delivery_time_frames: [
      DeliveryTimeFrame<'start'>,
      DeliveryTimeFrame<'end'>
    ]
    package_type: string
    shipment_options: ShipmentOption[]
    type: MyParcel.DeliveryType
  }

  interface PickupPossibility {
    delivery_type_id: number
    delivery_type_name: MyParcel.DeliveryType
    moment: {
      start: Timestamp
    }
  }

  interface FormConfig {
    name: string
    enabled?: string
    label?: string
    price?: string
    selected?: boolean
    options?: FormConfig[]
  }

  interface FormEntry {
    name: string
    type?: 'radio' | 'select' | 'checkbox' | 'text' | string
    choices?: FormEntryChoice[]
    component?: Vue
    dependency?: FormEntryDependency
    loop?: boolean
    pagination?: number
    hidden?: boolean
  }

  interface FormEntryChoice {
    name: string
    label?: string
    plainLabel?: string
    price?: number
    disabled?: boolean
    selected?: boolean
  }

  interface FormEntryDependency {
    name: string,
    parent: string,
    transform?: Function,
  }

  interface MapTileLayerData {
    url: string
    attribution: string
    token?: string
    maxZoom?: number
  }

  type CarrierDeliveryDependencies = Record<MyParcel.CarrierName, DeliveryDependencies>

  interface DeliveryDependencies {
    // ISO date string
    deliveryDate: Record<string, { deliveryMoment: DeliveryDependencyMoments }>;
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
     carrier: string;
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
