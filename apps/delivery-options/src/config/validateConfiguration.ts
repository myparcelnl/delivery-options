import {
  AddressField,
  CARRIER_SETTINGS,
  type CarrierSettings,
  type CarrierSettingsObject,
  type ConfigOption,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  DROP_OFF_DAYS,
  getAllConfigOptions,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  LOCALE,
  PLATFORM,
  SUPPORTED_PLATFORMS,
  validateDropOffDays,
  validateHasMinKeys,
  validateIsCountryCode,
  validateIsNumeric,
  validateIsObject,
  validateIsString,
  validateIsValue,
} from '@myparcel-do/shared';
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
    key: LOCALE,
    perCarrier: false,
    validators: [validateIsString()],
  },

  {
    key: PLATFORM,
    perCarrier: false,
    validators: [validateIsValue(SUPPORTED_PLATFORMS)],
  },

  {
    key: CARRIER_SETTINGS,
    perCarrier: false,
    validators: [validateIsObject(), validateHasMinKeys(1)],
  },

  {
    key: DROP_OFF_DAYS,
    validators: [validateDropOffDays()],
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
  const configOptionsPerCarrier = configOptions.filter((option) => option.perCarrier !== false);

  const processedConfig = processConfig(input, configOptions);

  return {
    ...processedConfig,
    [CARRIER_SETTINGS]: Object.entries(processedConfig[CARRIER_SETTINGS] ?? {}).reduce(
      (acc, [identifier, carrierSettings]) => {
        acc[identifier as keyof CarrierSettingsObject] = processConfig(carrierSettings ?? {}, configOptionsPerCarrier);

        return acc;
      },
      {} as CarrierSettingsObject,
    ),
  };
};

export const validateConfiguration = (input: InputDeliveryOptionsConfiguration): DeliveryOptionsConfiguration => {
  return {
    address: filterConfig({...input.address}, addressOptions),
    config: validateConfig({...input.config}),
    strings: {...input.strings},
  } as unknown as DeliveryOptionsConfiguration;
};
