import {
  validateHasMinKeys,
  validateIsCountryCode,
  validateIsNumeric,
  validateIsObject,
  validateIsString,
  validateIsValue,
} from '../validator';
import {getAllConfigOptions} from '../utils';
import {
  type ConfigOption,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  type InputDeliveryOptionsConfiguration,
} from '../types';
import {AddressField} from '../enums';
import {CARRIER_SETTINGS, PLATFORM} from '../data';
import {SUPPORTED_PLATFORMS} from '../constants';
import {useLogger} from './useLogger';

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
    key: PLATFORM,
    perCarrier: false,
    validators: [validateIsValue(SUPPORTED_PLATFORMS)],
  },
  {
    key: CARRIER_SETTINGS,
    perCarrier: false,
    validators: [validateIsObject(), validateHasMinKeys(1)],
  },
];

const filterConfig = <T>(input: object, allOptions: ConfigOption[]): T => {
  const logger = useLogger();

  return Object.entries(input).reduce((acc, [key, value]) => {
    const option = allOptions.find((option) => option.key === key);

    if (!option) {
      logger.error(`⚠️ Unknown config option: ${key}`);
      return acc;
    }

    const validators = option?.validators ?? [];

    const errors = validators.filter((entry) => !entry.validate(value)).map((entry) => entry.error);

    if (errors.length) {
      logger.error(`❌ [${key}]`, errors.join(', '), {value});
    } else {
      acc[key as keyof T] = validators.reduce((acc, item) => item.parse?.(acc) ?? acc, value);
    }

    return acc;
  }, {} as T);
};

export const validateDeliveryOptionsConfig = (
  input: InputDeliveryOptionsConfiguration,
): DeliveryOptionsConfiguration => {
  const configOptions: ConfigOption[] = [...getAllConfigOptions(), ...additionalOptions];
  const configOptionsPerCarrier = configOptions.filter((option) => option.perCarrier !== false);

  const filteredConfig = filterConfig<DeliveryOptionsConfig>(input.config, configOptions);

  filteredConfig[CARRIER_SETTINGS] = Object.entries(filteredConfig[CARRIER_SETTINGS] ?? {}).reduce(
    (acc, [identifier, carrierSettings]) => {
      acc[identifier] = filterConfig(carrierSettings as Record<string, unknown>, configOptionsPerCarrier);

      return acc;
    },
    {} as Record<string, unknown>,
  );

  return {
    address: filterConfig(input.address, addressOptions),
    config: filteredConfig,
    strings: input.strings,
  } as unknown as DeliveryOptionsConfiguration;
};
