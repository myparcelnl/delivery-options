import {camel} from 'radash';
import {type Translatable, createTranslatable} from '@myparcel-dev/shared';
import {type DeliveryTypeName} from '@myparcel-dev/constants';

export const createDeliveryTypeTranslatable = (deliveryType: DeliveryTypeName): Translatable => {
  return createTranslatable(camel(`delivery_${deliveryType}_title`));
};
