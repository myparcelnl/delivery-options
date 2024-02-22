import {ref} from 'vue';
import {type InternalOutput} from '@myparcel-do/shared';
import {type CreatedForm, defineField} from '@myparcel/vue-form-builder';
import {useDeliveryOptionsForm} from '../../form';
import {
  FIELD_DELIVERY_DATE,
  FIELD_HOME_OR_PICKUP,
  FIELD_PICKUP_LOCATION,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_MOMENT,
} from '../../data';

/**
 * Sets up the delivery options form with its fields.
 */
export const mockDeliveryOptionsForm = async (): Promise<CreatedForm<InternalOutput>> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Form = useDeliveryOptionsForm();

  await Promise.all([
    Form.instance.addElement(defineField<any>({name: FIELD_DELIVERY_DATE, ref: ref(), component: 'input'})),
    Form.instance.addElement(defineField<any>({name: FIELD_HOME_OR_PICKUP, ref: ref(), component: 'input'})),
    Form.instance.addElement(defineField<any>({name: FIELD_PICKUP_LOCATION, ref: ref(), component: 'input'})),
    Form.instance.addElement(defineField<any>({name: FIELD_SHIPMENT_OPTIONS, ref: ref(), component: 'input'})),
    Form.instance.addElement(defineField<any>({name: FIELD_DELIVERY_MOMENT, ref: ref(), component: 'input'})),
  ]);

  return Form;
};
