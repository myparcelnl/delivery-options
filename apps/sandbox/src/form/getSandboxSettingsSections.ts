import {AddressField, KEY_ADDRESS} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import FormTextInput from '../components/form/FormTextInput.vue';
import {getConfigurationSections} from './getConfigurationSections';
import {formSection} from './formSection';
import {formField} from './formField';

export const getSandboxSettingsSections = (): SettingsSection[] => {
  return [
    formSection({
      label: 'address',
      fields: [
        formField({
          name: AddressField.Street,
          key: KEY_ADDRESS,
          component: FormTextInput,
          attributes: {
            autocomplete: 'address-line1',
          },
        }),

        formField({
          name: AddressField.PostalCode,
          key: KEY_ADDRESS,
          component: FormTextInput,
          attributes: {
            autocomplete: 'postal-code',
          },
        }),

        formField({
          name: AddressField.City,
          key: KEY_ADDRESS,
          component: FormTextInput,
          attributes: {
            autocomplete: 'address-level2',
          },
        }),
      ],
    }),

    ...getConfigurationSections(),

    formSection({
      label: 'strings',
      fields: [],
    }),
  ];
};
