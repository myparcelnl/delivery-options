/* eslint-disable @typescript-eslint/no-magic-numbers */
import {assign} from 'radash';
import {
  CarrierSetting,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_SAME_DAY_CUTOFF_TIME,
  DROP_OFF_WEEKDAY,
  type InputDeliveryOptionsConfig,
  getDefaultDeliveryOptionsConfig,
} from '@myparcel-dev/do-shared';

export const getDefaultSandboxConfig = (): InputDeliveryOptionsConfig => {
  const defaults = getDefaultDeliveryOptionsConfig();

  return assign<InputDeliveryOptionsConfig>(defaults, {
    [CarrierSetting.DropOffDelay]: 1,
    [CarrierSetting.DeliveryDaysWindow]: 7,
    [CarrierSetting.DropOffDays]: [
      {
        [DROP_OFF_WEEKDAY]: 2,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 3,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 4,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 5,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
    ],
  });
};
