import {type InternalOutput} from '@myparcel-dev/do-shared';
import {type CreatedForm, defineField} from '@myparcel-dev/vue-form-builder';
import {useDeliveryOptionsForm} from '../../form';
import {
  FIELD_DELIVERY_DATE,
  FIELD_HOME_OR_PICKUP,
  FIELD_PICKUP_LOCATION,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_MOMENT,
} from '../../data';
import {useSelectedValues} from '../../composables';

/**
 * Sets up the delivery options form with its fields.
 */
export const mockDeliveryOptionsForm = async (): Promise<CreatedForm<InternalOutput>> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Form = useDeliveryOptionsForm();

  const {deliveryMoment, deliveryDate, shipmentOptions, pickupLocation, homeOrPickup} = useSelectedValues();

  await Promise.all([
    Form.instance.addElement(
      defineField<any>({
        name: FIELD_DELIVERY_DATE,
        ref: deliveryDate,
        component: 'input',
      }),
    ),
    Form.instance.addElement(
      defineField<any>({
        name: FIELD_HOME_OR_PICKUP,
        ref: homeOrPickup,
        component: 'input',
      }),
    ),
    Form.instance.addElement(
      defineField<any>({
        name: FIELD_PICKUP_LOCATION,
        ref: pickupLocation,
        component: 'input',
      }),
    ),
    Form.instance.addElement(
      defineField<any>({
        name: FIELD_SHIPMENT_OPTIONS,
        ref: shipmentOptions,
        component: 'input',
      }),
    ),
    Form.instance.addElement(
      defineField<any>({
        name: FIELD_DELIVERY_MOMENT,
        ref: deliveryMoment,
        component: 'input',
      }),
    ),
  ]);

  return Form;
};
