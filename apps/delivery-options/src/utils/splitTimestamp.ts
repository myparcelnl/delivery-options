import {type TimestampString} from '@myparcel-do/shared';

export const splitTimestamp = (timestamp: TimestampString): [number, number] => {
  const [hours, minutes] = timestamp.split(':');

  return [Number(hours), Number(minutes)];
};
