import {CONFIG, CONSTS, FORM_PACKAGE_TYPE, KEY_CONFIG} from '@myparcel-do/shared';
import {formField} from '../formField';
import SelectInput from '../components/form/FormSelectInput.vue';
import CurrencyInput from '../components/form/FormCurrencyInput.vue';
import {type SettingsGroup} from '../../types/form.types';
import {ifAnyCarrierAllows} from './ifAnyCarrierAllows';
import {formGroup} from './formGroup';

export const getPackageTypeGroup = (): SettingsGroup =>
  formGroup({
    label: FORM_PACKAGE_TYPE,
    fields: [
      formField({
        key: KEY_CONFIG,
        name: CONFIG.PACKAGE_TYPE,
        component: SelectInput,
        props: {
          options: CONSTS.PACKAGE_TYPE_OPTIONS,
        },
      }),
      ...ifAnyCarrierAllows(
        CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
        formField({
          key: KEY_CONFIG,
          name: CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
          component: CurrencyInput,

          // conditions: [CONFIG.SHOW_PRICES],
        }),
      ),
      ...ifAnyCarrierAllows(
        CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
        formField({
          key: KEY_CONFIG,
          name: CONFIG.PRICE_PACKAGE_TYPE_MAILBOX,
          component: CurrencyInput,

          // conditions: [CONFIG.SHOW_PRICES],
        }),
      ),
    ],
  });
