import {type SettingsSection} from '../types';
import {optionGroupMap} from './form';
import {createChildSections} from './createChildSections';
import {createChildFields} from './createChildFields';

export const getConfigurationSections = (): SettingsSection[] => {
  return optionGroupMap.map((group) => {
    const childFields = createChildFields(group);
    const childSections = createChildSections(group);

    return {
      label: group.name,
      fields: [
        {
          key: group.name,
          description: group.name,
          fields: [...childFields, ...childSections],
        },
      ],
    };
  });
};
