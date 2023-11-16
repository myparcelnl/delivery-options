import {CONFIG, DELIVERY_MORNING, KEY_CONFIG, KEY_STRINGS, STRINGS} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TextInput from '../components/form/FormTextInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getMorningDeliveryGroup = (): SettingsGroup =>
  formGroup({
    label: DELIVERY_MORNING,
    fields: [
      ...perCarrier({
        name: CONFIG.ALLOW_MORNING_DELIVERY,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
      formField({
        key: KEY_STRINGS,
        name: STRINGS.DELIVERY_MORNING_TITLE,
        component: TextInput,
        // conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        // inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY)],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.PRICE_MORNING_DELIVERY,
        component: CurrencyInput,
        // conditions: [
        //   CONFIG.SHOW_PRICES,
        //   inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        //   inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY),
        // ],
      }),
    ],
  });
