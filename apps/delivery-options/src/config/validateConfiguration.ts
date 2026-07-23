import {isObject} from 'radash';
import {isEnumValue} from '@myparcel-dev/ts-utils';
import {
  AddressField,
  CarrierSetting,
  type CarrierSettings,
  type CarrierSettingsObject,
  type CartShipmentOptions,
  type CarrierIdentifier,
  resolveCarrierName,
  type ConfigOption,
  ConfigSetting,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  getAllConfigOptions,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  KEY_CART_SHIPMENT_OPTIONS,
  validateDropOffDays,
  validateHasMinKeys,
  validateIsBoolean,
  validateIsCountryCode,
  validateIsNumeric,
  validateIsObject,
  validateIsString,
  validateIsTime,
  validateIsValue,
  validateMatch,
  defineConfig,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
  type DeliveryOptionsAddress,
} from '@myparcel-dev/do-shared';
import {PackageTypeName} from '@myparcel-dev/constants';
import {filterConfig} from './filterConfig';

const addressOptions: ConfigOption[] = [
  {
    key: AddressField.Country,
    validators: [validateIsCountryCode()],
  },
  {
    key: AddressField.Street,
    validators: [validateIsString()],
  },
  {
    key: AddressField.Number,
    validators: [validateIsNumeric()],
  },
  {
    key: AddressField.PostalCode,
    validators: [validateIsString()],
  },
  {
    key: AddressField.City,
    validators: [validateIsString()],
  },
];

const additionalOptions: ConfigOption[] = [
  {
    key: ConfigSetting.Platform,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.Locale,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.Currency,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.ApiBaseUrl,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.ProxyCapabilities,
    perCarrier: false,
    validators: [validateIsString(), validateMatch(/.+/)],
  },
  {
    key: ConfigSetting.ApiKey,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.ShowPrices,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: ConfigSetting.ShowPriceSurcharge,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: ConfigSetting.ExcludeParcelLockers,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: ConfigSetting.CompactView,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: ConfigSetting.PopUpMap,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: KEY_CARRIER_SETTINGS,
    perCarrier: false,
    validators: [validateIsObject(), validateHasMinKeys(1)],
  },

  {
    key: CarrierSetting.DropOffDays,
    validators: [validateDropOffDays()],
  },
  {
    key: CarrierSetting.CutoffTime,
    validators: [validateIsTime()],
  },
  {
    key: CarrierSetting.CutoffTimeSameDay,
    validators: [validateIsTime()],
  },
  {
    key: CarrierSetting.PackageType,
    validators: [validateIsValue(Object.values(PackageTypeName))],
  },
];

const processConfig = <T extends InputDeliveryOptionsConfig | CarrierSettings>(
  input: T,
  configOptions: ConfigOption[],
): T extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings => {
  return filterConfig({...input}, configOptions);
};

/**
 * Clean up the cartShipmentOptions input. PHP serializes an empty map as an empty array, so
 * arrays and any other non-object input become an empty object. Carrier keys are normalized
 * to the bare carrier name ('postnl:123' → 'postnl'), carrier entries that are not plain
 * objects are dropped, and within each carrier only boolean option values are kept.
 *
 * A '__proto__' carrier key is dropped: Object.assign()-ing a map with that key onto another
 * object (as the store does) would replace that object's prototype. When two keys normalize
 * to the same carrier name, the last one wins.
 *
 * @param input - The raw cartShipmentOptions value from the configuration input.
 * @returns A safe carrier name → option name → on/off map; empty when the input was unusable.
 */
const sanitizeCartShipmentOptions = (input: unknown): CartShipmentOptions => {
  if (!isObject(input)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input)
      .filter((entry): entry is [string, Record<string, unknown>] => isObject(entry[1]))
      .map(([carrier, carrierOptions]): [string, Record<string, boolean>] => [
        resolveCarrierName(carrier as CarrierIdentifier),
        Object.fromEntries(
          Object.entries(carrierOptions).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
        ),
      ])
      .filter(([carrier]) => carrier !== '__proto__'),
  );
};

const validateConfig = (input: InputDeliveryOptionsConfig): DeliveryOptionsConfig => {
  const configOptions: ConfigOption[] = [...getAllConfigOptions(), ...additionalOptions];
  const configOptionsPerCarrier = configOptions.filter(
    (option) => option.perCarrier ?? isEnumValue(option.key, CarrierSetting),
  );

  const processedConfig = processConfig(input, configOptions);

  return {
    ...processedConfig,
    [KEY_CARRIER_SETTINGS]: Object.entries(processedConfig[KEY_CARRIER_SETTINGS] ?? {}).reduce(
      (acc, [identifier, carrierSettings]) => {
        acc[identifier as keyof CarrierSettingsObject] = processConfig(carrierSettings ?? {}, configOptionsPerCarrier);

        return acc;
      },
      {} as CarrierSettingsObject,
    ),
  };
};

export const validateConfiguration = (input: InputDeliveryOptionsConfiguration): DeliveryOptionsConfiguration => {
  const addressInput = Object.fromEntries(
    Object.entries(input[KEY_ADDRESS] ?? {}).filter(([, value]) => value !== '' && value !== null),
  );
  const filteredAddressConfig: DeliveryOptionsAddress = filterConfig(addressInput, addressOptions);

  const result: Partial<InputDeliveryOptionsConfiguration> = {
    [KEY_ADDRESS]: filteredAddressConfig,
  };

  // Only add keys that exist in input
  if (input[KEY_CONFIG] !== undefined) {
    result[KEY_CONFIG] = validateConfig({...input[KEY_CONFIG]});
  }

  if (input[KEY_STRINGS] !== undefined) {
    result[KEY_STRINGS] = {...input[KEY_STRINGS]};
  }

  if (input[KEY_CART_SHIPMENT_OPTIONS] !== undefined) {
    result[KEY_CART_SHIPMENT_OPTIONS] = sanitizeCartShipmentOptions(input[KEY_CART_SHIPMENT_OPTIONS]);
  }

  // Ensure address is always present
  return defineConfig(result as InputDeliveryOptionsConfiguration) as unknown as DeliveryOptionsConfiguration;
};
