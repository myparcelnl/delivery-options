import {type TimestampString} from '../types';

export const splitTimestamp = (timestamp: TimestampString): [number, number] => {
  const [hours, minutes] = timestamp.split(':');

  return [Number(hours), Number(minutes)];
};
