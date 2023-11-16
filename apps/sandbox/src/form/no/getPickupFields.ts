import {CONFIG, KEY_CONFIG, KEY_STRINGS, STRINGS} from '@myparcel-do/shared';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TextInput from '../components/form/FormTextInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {perCarrier} from './perCarrier';

export const getPickupFields = () => {
  return [
    ...perCarrier({
      name: CONFIG.ALLOW_PICKUP_LOCATIONS,
      component: ToggleInput,
    }),

    formField({
      key: KEY_STRINGS,
      name: STRINGS.PICKUP_TITLE,
      component: TextInput,
      // conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
    }),
    formField({
      key: KEY_CONFIG,
      name: CONFIG.PRICE_PICKUP,
      component: CurrencyInput,
      // conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
    }),
  ];
};
