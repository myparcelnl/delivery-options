import {isObject} from 'radash';
import {CarrierSetting, type DropOffEntryObject, type Weekday} from '@myparcel-do/shared';
import {partitionArray} from '@myparcel/ts-utils';
import {type ResolvedCarrier} from '../types';

export const calculateDropOffDays = (carrier: ResolvedCarrier): string | undefined => {
  const setting = carrier.get(CarrierSetting.DropOffDays, []);

  const [funky, flat] = partitionArray(setting, isObject) as [DropOffEntryObject[], Weekday[]];

  return [...funky.map((entry) => entry.weekday), ...flat].sort().join(';');
};
