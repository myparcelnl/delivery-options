import {isOfType} from '@myparcel-dev/ts-utils';

export const isCustomEvent = <Detail>(event: Event | CustomEvent<Detail>): event is CustomEvent<Detail> => {
  return isOfType<CustomEvent>(event, 'detail');
};
