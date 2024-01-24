import {isOfType} from '@myparcel/ts-utils';

export const isCustomEvent = <Detail>(event: Event | CustomEvent): event is CustomEvent<Detail> => {
  return isOfType<CustomEvent>(event, 'detail');
};
