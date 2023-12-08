import {isString} from 'radash';
import {isDefined} from '@vueuse/core';
import {
  CarrierSetting,
  type CarrierSettings,
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
} from '@myparcel-do/shared';
import {toArray} from '@myparcel/ts-utils';

const parseDropOffDays = (value?: string | DropOffEntry[]): DropOffEntry[] => {
  let array: DropOffEntry[] = [];

  if (isString(value)) {
    array = toArray(value, ';').map(Number) as Weekday[];
  } else if (Array.isArray(value)) {
    array = value.map((item) => (isString(item) ? Number(item) : item)) as DropOffEntry[];
  }

  return array;
};

type ResolvedInputConfig<Input extends InputDeliveryOptionsConfig | InputCarrierSettings> =
  Input extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings;

export const handleDeprecatedOptions = <Input extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: Input,
): ResolvedInputConfig<Input> => {
  const logger = useLogger();

  const {allowShowDeliveryDate, saturdayCutoffTime, fridayCutoffTime, ...restConfig} = {...input};

  const resolvedConfig = restConfig as unknown as ResolvedInputConfig<Input>;

  if (isDefined(allowShowDeliveryDate)) {
    logger.deprecated(DeprecatedCarrierSetting.AllowShowDeliveryDate, CarrierSetting.ShowDeliveryDate);
    resolvedConfig[CarrierSetting.ShowDeliveryDate] = allowShowDeliveryDate;
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

    resolvedConfig[CarrierSetting.DropOffDays] = (resolvedConfig.dropOffDays ?? []).map((weekday) => {
      if (weekday !== DAY_FRIDAY && weekday !== DAY_SATURDAY) {
        return weekday;
      }

      return {
        [DROP_OFF_WEEKDAY]: weekday,
        [DROP_OFF_CUTOFF_TIME]: weekday === DAY_FRIDAY ? fridayCutoffTime : saturdayCutoffTime,
      };
    }) satisfies DropOffEntry[];
  }

  return resolvedConfig;
};
