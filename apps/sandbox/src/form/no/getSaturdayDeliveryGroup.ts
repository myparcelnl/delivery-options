import {CONFIG, KEY_CONFIG, SATURDAY_DELIVERY} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TimeInput from '../components/form/FormTimeInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getSaturdayDeliveryGroup = (): SettingsGroup => {
  return formGroup({
    label: SATURDAY_DELIVERY,
    fields: [
      ...perCarrier({
        name: CONFIG.ALLOW_SATURDAY_DELIVERY,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.FRIDAY_CUTOFF_TIME,
        component: TimeInput,
        // conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        // inAnyCarrier(CONFIG.ALLOW_SATURDAY_DELIVERY)],
      }),
    ],
  });
};
