import {isString} from 'radash';
import {
  type CarrierSettings,
  CUTOFF_TIME,
  CUTOFF_TIME_DEFAULT,
  CUTOFF_TIME_SAME_DAY,
  type DeliveryOptionsConfig,
  type InputCarrierSettings,
  type InputDeliveryOptionsConfig,
  toArrayWithAnySeparator,
  type Weekday,
} from '@myparcel-do/shared';
import {type OneOrMore} from '@myparcel/ts-utils';
import {DAY_FRIDAY, DAY_SATURDAY} from '../constants';

const parseDropOffDays = (value?: OneOrMore<string | number>): number[] => {
  let array: (string | number)[] = [];

  if (isString(value)) {
    array = toArrayWithAnySeparator(value);
  } else if (Array.isArray(value)) {
    array = value;
  }

  return array.map(Number);
};

export const handleDeprecatedOptions = <T extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: T,
): T extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings => {
  const {cutoffTime, dropOffDays, cutoffTimeSameDay, saturdayCutoffTime, fridayCutoffTime, ...restConfig} = input ?? {};

  const hasLegacyOption = Boolean(
    cutoffTime ?? dropOffDays?.length ?? cutoffTimeSameDay ?? saturdayCutoffTime ?? fridayCutoffTime,
  );

  if (hasLegacyOption) {
    restConfig.dropOffPossibilities = parseDropOffDays(dropOffDays).map((day) => {
      let currentCutOffTime = cutoffTime;

      if (String(day) === DAY_FRIDAY) {
        currentCutOffTime = fridayCutoffTime;
      } else if (String(day) === DAY_SATURDAY) {
        currentCutOffTime = saturdayCutoffTime;
      }

      return {
        day: day.toString() as `${Weekday}`,
        [CUTOFF_TIME]: currentCutOffTime ?? cutoffTime ?? CUTOFF_TIME_DEFAULT,
        [CUTOFF_TIME_SAME_DAY]: cutoffTimeSameDay,
      };
    });
  }

  return restConfig;
};
