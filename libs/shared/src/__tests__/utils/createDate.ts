import {setDay, setHours, setMinutes} from 'date-fns';

export const createDate = (weekday = 0, hours = 0, minutes = 0): Date =>
  setMinutes(setHours(setDay(new Date(), weekday), hours), minutes);
