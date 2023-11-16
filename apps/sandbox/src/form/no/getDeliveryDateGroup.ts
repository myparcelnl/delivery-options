import {CONFIG} from '@myparcel-do/shared';
import ToggleInput from '../components/form/FormToggleInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getDeliveryDateGroup = (): SettingsGroup => {
  return formGroup({
    label: CONFIG.FEATURE_SHOW_DELIVERY_DATE,
    fields: [
      ...perCarrier({
        name: CONFIG.FEATURE_SHOW_DELIVERY_DATE,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
    ],
  });
};
