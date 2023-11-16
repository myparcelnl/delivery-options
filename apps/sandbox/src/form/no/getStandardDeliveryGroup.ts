import {CONFIG, DELIVERY_STANDARD, KEY_CONFIG, KEY_STRINGS, STRINGS} from '@myparcel-do/shared';
import {formField} from '../formField';
import TextInput from '../components/form/FormTextInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {formGroup} from './formGroup';

export const getStandardDeliveryGroup = (): SettingsGroup =>
  formGroup({
    label: DELIVERY_STANDARD,
    fields: [
      formField({
        key: KEY_STRINGS,
        name: STRINGS.DELIVERY_STANDARD_TITLE,
        component: TextInput,
        // conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS)],
      }),
      formField({
        key: KEY_CONFIG,
        name: CONFIG.PRICE_STANDARD_DELIVERY,
        component: CurrencyInput,
        // conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS)],
      }),
    ],
  });
