import {isString} from 'radash';
import {isDefined} from '@vueuse/core';
import {toArray} from '@myparcel-dev/ts-utils';
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
} from '@myparcel-dev/do-shared';

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

const applyDeprecatedAllowDeliveryOptions = (
  resolvedConfig: DeliveryOptionsConfig | CarrierSettings,
  restConfig: InputDeliveryOptionsConfig | InputCarrierSettings,
  logger: ReturnType<typeof useLogger>,
): void => {
  if (
    isDefined(resolvedConfig[CarrierSetting.AllowDeliveryOptions]) &&
    !isDefined(resolvedConfig[CarrierSetting.AllowStandardDelivery]) &&
    !isDefined(resolvedConfig[CarrierSetting.AllowExpressDelivery])
  ) {
    logger.deprecated(
      `Passing only ${CarrierSetting.AllowDeliveryOptions} without ${CarrierSetting.AllowStandardDelivery}`,
      `${CarrierSetting.AllowDeliveryOptions}: true and ${CarrierSetting.AllowStandardDelivery}: true and/or and ${CarrierSetting.AllowExpressDelivery}: true`,
    );

    resolvedConfig[CarrierSetting.AllowStandardDelivery] = restConfig[CarrierSetting.AllowDeliveryOptions];
  }
};

const applyDeprecatedShowDeliveryDate = (
  resolvedConfig: DeliveryOptionsConfig | CarrierSettings,
  logger: ReturnType<typeof useLogger>,
  allowShowDeliveryDate?: boolean,
  showDeliveryDate?: boolean,
): void => {
  if (isDefined(allowShowDeliveryDate)) {
    logger.deprecated(DeprecatedCarrierSetting.AllowShowDeliveryDate, 'show delivery date is always enabled');
  }

  if (isDefined(showDeliveryDate)) {
    logger.deprecated(ConfigSetting.ShowDeliveryDate, 'show delivery date is always enabled');
  }

  if (!isDefined(showDeliveryDate) && isDefined(allowShowDeliveryDate)) {
    resolvedConfig[ConfigSetting.ShowDeliveryDate] = allowShowDeliveryDate;
    return;
  }

  if (isDefined(showDeliveryDate)) {
    resolvedConfig[ConfigSetting.ShowDeliveryDate] = showDeliveryDate;
  }
};

/* eslint-disable max-params */
const normalizeDropOffDays = (
  resolvedConfig: DeliveryOptionsConfig | CarrierSettings,
  restConfig: InputDeliveryOptionsConfig | InputCarrierSettings,
  fridayCutoffTime: string | undefined,
  saturdayCutoffTime: string | undefined,
  logger: ReturnType<typeof useLogger>,
): void => {
  /* eslint-enable max-params */
  if (isString(restConfig.dropOffDays)) {
    logger.deprecated(`Passing ${CarrierSetting.DropOffDays} as a string`, `an array`);
    resolvedConfig.dropOffDays = parseDropOffDays(restConfig.dropOffDays);
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
};

export const handleDeprecatedOptions = <Input extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: Input,
): ResolvedInputConfig<Input> => {
  const logger = useLogger();

  const {allowShowDeliveryDate, showDeliveryDate, fridayCutoffTime, saturdayCutoffTime, ...restConfig} = {
    ...(input as InputDeliveryOptionsConfig & {showDeliveryDate?: boolean}),
  };

  const resolvedConfig = restConfig as unknown as ResolvedInputConfig<Input>;

  applyDeprecatedAllowDeliveryOptions(resolvedConfig, restConfig, logger);
  applyDeprecatedShowDeliveryDate(resolvedConfig, logger, allowShowDeliveryDate, showDeliveryDate);
  normalizeDropOffDays(resolvedConfig, restConfig, fridayCutoffTime, saturdayCutoffTime, logger);

  return resolvedConfig;
};
