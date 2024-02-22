import {isString} from 'radash';
import {isDefined} from '@vueuse/core';
import {
  CarrierSetting,
  type CarrierSettings,
  ConfigSetting,
  DAY_FRIDAY,
  DAY_SATURDAY,
  type DeliveryOptionsConfig,
  DeprecatedCarrierSetting,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_WEEKDAY,
  type DropOffEntry,
  type InputCarrierSettings,
  type InputDeliveryOptionsConfig,
  useLogger,
  type Weekday,
  type DropOffEntryObject,
} from '@myparcel-do/shared';
import {toArray} from '@myparcel/ts-utils';

const parseDropOffDays = (value?: string | DropOffEntry[]): DropOffEntryObject[] => {
  let array: (Weekday | `${Weekday}` | DropOffEntryObject)[] = [];

  if (isString(value)) {
    array = toArray(value, ';') as (Weekday | `${Weekday}`)[];
  } else if (Array.isArray(value)) {
    array = value.map((item) => item);
  }

  return array.map((item): DropOffEntryObject => ({[DROP_OFF_WEEKDAY]: Number(item) as Weekday}));
};

type ResolvedInputConfig<Input extends InputDeliveryOptionsConfig | InputCarrierSettings> =
  Input extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings;

export const handleDeprecatedOptions = <Input extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: Input,
): ResolvedInputConfig<Input> => {
  const logger = useLogger();

  const {allowShowDeliveryDate, fridayCutoffTime, saturdayCutoffTime, ...restConfig} = {...input};

  const resolvedConfig = restConfig as unknown as ResolvedInputConfig<Input>;

  if (
    isDefined(resolvedConfig[CarrierSetting.AllowDeliveryOptions]) &&
    !isDefined(resolvedConfig[CarrierSetting.AllowStandardDelivery])
  ) {
    logger.deprecated(
      `Passing only ${CarrierSetting.AllowDeliveryOptions} without ${CarrierSetting.AllowStandardDelivery}`,
      `${CarrierSetting.AllowDeliveryOptions}: true and ${CarrierSetting.AllowStandardDelivery}: true`,
    );

    resolvedConfig[CarrierSetting.AllowStandardDelivery] = restConfig[CarrierSetting.AllowDeliveryOptions];
  }

  if (isDefined(allowShowDeliveryDate)) {
    logger.deprecated(DeprecatedCarrierSetting.AllowShowDeliveryDate, ConfigSetting.ShowDeliveryDate);
    resolvedConfig[ConfigSetting.ShowDeliveryDate] = allowShowDeliveryDate;
  }

  if (typeof resolvedConfig.dropOffDays === 'string') {
    logger.deprecated(`Passing ${CarrierSetting.DropOffDays} as a string`, `an array`);
    resolvedConfig.dropOffDays = parseDropOffDays(resolvedConfig.dropOffDays);
  }

  if (isDefined(saturdayCutoffTime) || isDefined(fridayCutoffTime)) {
    logger.deprecated(
      `Passing ${DeprecatedCarrierSetting.SaturdayCutoffTime} or ${DeprecatedCarrierSetting.FridayCutoffTime}`,
      `${CarrierSetting.DropOffDays} with objects containing ${DROP_OFF_CUTOFF_TIME}`,
    );

    resolvedConfig[CarrierSetting.DropOffDays] = (resolvedConfig.dropOffDays ?? []).map((entry) => {
      if (entry.weekday !== DAY_FRIDAY && entry.weekday !== DAY_SATURDAY) {
        return entry;
      }

      return {
        ...entry,
        [DROP_OFF_CUTOFF_TIME]: entry.weekday === DAY_FRIDAY ? fridayCutoffTime : saturdayCutoffTime,
      };
    }) satisfies DropOffEntryObject[];
  }

  return resolvedConfig;
};
