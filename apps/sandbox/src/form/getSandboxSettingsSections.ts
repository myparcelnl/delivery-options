import {AddressField, ALL_OPTIONS, KEY_ADDRESS} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import FormTextInput from '../components/form/FormTextInput.vue';
import {formField} from './formField';
import {createFields} from './createFields';

function getConfigurationSections(): SettingsSection[] {
  const groups = new Set(ALL_OPTIONS.map((option) => option.group));
  const sections = new Map<string, SettingsSection>();

  groups.forEach((group) => {
    sections.set(group, {
      label: group,
      fields: [],
    });
  });

  ALL_OPTIONS.forEach((option) => {
    const section = sections.get(option.group);

    if (!section) {
      // eslint-disable-next-line no-console
      console.error(`No section found for group ${option.group}`);
      return;
    }

    section?.fields.push({
      label: option.key,
      fields: createFields(option),
    });

    sections.set(option.group, section);
  });

  return Array.from(sections.values());
}

export const getSandboxSettingsSections = (): SettingsSection[] => {
  return [
    {
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
    },

    ...getConfigurationSections(),

    {
      label: 'strings',
      fields: [],
    },
  ];
};
