import {camel} from 'radash';
import {type Translatable, createTranslatable} from '@myparcel-do/shared';
import {type DeliveryTypeName} from '@myparcel/constants';

export const createDeliveryTypeTranslatable = (deliveryType: DeliveryTypeName): Translatable => {
  return createTranslatable(camel(`delivery_${deliveryType}_title`));
};
