import {
  AddressField,
  CARRIER_SETTINGS,
  type CarrierSettingsObject,
  type ConfigOption,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  DROP_OFF_POSSIBILITIES,
  getAllConfigOptions,
  type InputDeliveryOptionsConfiguration,
  LOCALE,
  PLATFORM,
  SUPPORTED_PLATFORMS,
  validateDropOffPossibilities,
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
    key: DROP_OFF_POSSIBILITIES,
    validators: [validateDropOffPossibilities()],
  },
];

export const validateConfig = (input: InputDeliveryOptionsConfiguration): DeliveryOptionsConfiguration => {
  const configOptions: ConfigOption[] = [...getAllConfigOptions(), ...additionalOptions];
  const configOptionsPerCarrier = configOptions.filter((option) => option.perCarrier !== false);

  const filteredConfig = filterConfig<DeliveryOptionsConfig>(handleDeprecatedOptions(input.config), configOptions);

  filteredConfig[CARRIER_SETTINGS] = Object.entries(filteredConfig[CARRIER_SETTINGS] ?? {}).reduce(
    (acc, [identifier, carrierSettings]) => {
      const resolved = handleDeprecatedOptions(carrierSettings ?? {});

      acc[identifier as keyof CarrierSettingsObject] = filterConfig(resolved, configOptionsPerCarrier);

      return acc;
    },
    {} as CarrierSettingsObject,
  );

  return {
    address: filterConfig(input.address, addressOptions),
    config: filteredConfig,
    strings: input.strings,
  } as unknown as DeliveryOptionsConfiguration;
};
