import {CONFIG, DELIVERY_EVENING, KEY_CONFIG, KEY_STRINGS, STRINGS} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TextInput from '../components/form/FormTextInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {perCarrier} from './perCarrier';
import {formGroup} from './formGroup';

export const getEveningDeliveryGroup = (): SettingsGroup =>
  formGroup({
    label: DELIVERY_EVENING,
    fields: [
      ...perCarrier({
        name: CONFIG.ALLOW_EVENING_DELIVERY,
        component: ToggleInput,
        // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
      }),
      formField({
        key: KEY_STRINGS,
        name: STRINGS.DELIVERY_EVENING_TITLE,
        component: TextInput,
        // conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        // inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY)],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.PRICE_EVENING_DELIVERY,
        component: CurrencyInput,
        // conditions: [
        //   CONFIG.SHOW_PRICES,
        //   inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        //   inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY),
        // ],
      }),
    ],
  });
