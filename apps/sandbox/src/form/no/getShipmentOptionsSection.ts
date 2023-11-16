import {
  CONFIG,
  KEY_CONFIG,
  KEY_STRINGS,
  ONLY_RECIPIENT,
  SHIPMENT_OPTIONS,
  SIGNATURE,
  STRINGS,
} from '@myparcel-do/shared';
import {type SettingsSection} from '../types/settings.types';
import {formField} from '../formField';
import ToggleInput from '../components/form/FormToggleInput.vue';
import TextInput from '../components/form/FormTextInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {perCarrier} from './perCarrier';
import {ifAnyCarrierAllows} from './ifAnyCarrierAllows';
import {formSection} from './formSection';
import {formGroup} from './formGroup';

export const getShipmentOptionsSection = (): SettingsSection => {
  return formSection({
    label: SHIPMENT_OPTIONS,
    fields: [
      ...ifAnyCarrierAllows(CONFIG.ALLOW_ONLY_RECIPIENT, {
        label: ONLY_RECIPIENT,
        fields: [
          ...perCarrier({
            name: CONFIG.ALLOW_ONLY_RECIPIENT,
            component: ToggleInput,
            // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
          }),
          formField({
            key: KEY_STRINGS,
            name: STRINGS.ONLY_RECIPIENT_TITLE,
            component: TextInput,
            // conditions: [inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT)],
          }),
          formField({
            key: KEY_CONFIG,
            name: CONFIG.PRICE_ONLY_RECIPIENT,
            component: CurrencyInput,

            // conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT)],
          }),
        ],
      }),

      ...ifAnyCarrierAllows(
        CONFIG.ALLOW_SIGNATURE,
        formGroup({
          label: SIGNATURE,
          fields: [
            ...perCarrier({
              name: CONFIG.ALLOW_SIGNATURE,
              component: ToggleInput,
              // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            formField({
              key: KEY_STRINGS,
              name: STRINGS.SIGNATURE_TITLE,
              component: TextInput,
              // conditions: [inAnyCarrier(CONFIG.ALLOW_SIGNATURE)],
            }),
            formField({
              key: KEY_CONFIG,
              name: CONFIG.PRICE_SIGNATURE,
              component: CurrencyInput,

              // conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_SIGNATURE)],
            }),
          ],
        }),
      ),
    ],
  });
};
