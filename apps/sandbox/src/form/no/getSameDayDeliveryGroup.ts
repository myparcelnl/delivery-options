import {CONFIG, DELIVERY_SAME_DAY, KEY_CONFIG} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getSameDayDeliveryGroup = (): SettingsGroup =>
  formGroup({
    label: DELIVERY_SAME_DAY,
    fields: [
      ...perCarrier({
        key: KEY_CONFIG,
        name: CONFIG.ALLOW_SAME_DAY_DELIVERY,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.PRICE_SAME_DAY_DELIVERY,
        component: CurrencyInput,
        // conditions: [
        //   CONFIG.SHOW_PRICES,
        //   CONFIG.ALLOW_DELIVERY_OPTIONS,
        //   inAnyCarrier(CONFIG.ALLOW_SAME_DAY_DELIVERY),
        // ],
      }),
    ],
  });
