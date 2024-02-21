import {camel} from 'radash';
import {type Translatable} from '@myparcel-do/shared';
import {type DeliveryTypeName} from '@myparcel/constants';
import {createTranslatable} from './createTranslatable';

export const createDeliveryTypeTranslatable = (deliveryType: DeliveryTypeName): Translatable => {
  return createTranslatable(camel(`delivery_${deliveryType}_title`));
};
