import {CONFIG, KEY_CONFIG, MONDAY_DELIVERY} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TimeInput from '../components/form/FormTimeInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getMondayDeliveryGroup = (): SettingsGroup => {
  return formGroup({
    label: MONDAY_DELIVERY,
    fields: [
      ...perCarrier({
        name: CONFIG.ALLOW_MONDAY_DELIVERY,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.SATURDAY_CUTOFF_TIME,
        component: TimeInput,
        // conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        // inAnyCarrier(CONFIG.ALLOW_MONDAY_DELIVERY)],
      }),
    ],
  });
};
