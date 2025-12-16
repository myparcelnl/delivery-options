import {toRaw} from 'vue';
import {
  AddressField,
  CarrierSetting,
  type CarrierSettings,
  type CarrierSettingsObject,
  type ConfigOption,
  ConfigSetting,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  getAllConfigOptions,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  validateDropOffDays,
  validateHasMinKeys,
  validateIsBoolean,
  validateIsCountryCode,
  validateIsNumeric,
  validateIsObject,
  validateIsString,
  validateIsTime,
  validateIsValue,
  defineConfig,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
  KEY_PLATFORM_CONFIG,
  type DeliveryOptionsAddress,
} from '@myparcel-dev/do-shared';
import {isEnumValue} from '@myparcel-dev/ts-utils';
import {PackageTypeName} from '@myparcel-dev/constants';
import {handleDeprecatedOptions} from './handleDeprecatedOptions';
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
    key: ConfigSetting.Platform,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.ApiBaseUrl,
    perCarrier: false,
    validators: [validateIsString()],
  },
  {
    key: ConfigSetting.ShowPrices,
    perCarrier: false,
    validators: [validateIsBoolean()],
  },
  {
    key: ConfigSetting.ShowDeliveryDate,
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
  return filterConfig(handleDeprecatedOptions(input), configOptions);
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
  const filteredAddressConfig: DeliveryOptionsAddress = filterConfig({...input[KEY_ADDRESS]}, addressOptions);

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

  if (input[KEY_PLATFORM_CONFIG] !== undefined) {
    result[KEY_PLATFORM_CONFIG] = toRaw(input[KEY_PLATFORM_CONFIG]);
  }

  // Ensure address is always present
  return defineConfig(result as InputDeliveryOptionsConfiguration) as unknown as DeliveryOptionsConfiguration;
};
