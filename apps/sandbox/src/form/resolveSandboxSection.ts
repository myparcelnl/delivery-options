import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {formSection} from './formSection';
import {createChildFields} from './createChildFields';

export const resolveSandboxSection = (group: SandboxOptionGroup, prefix: string): SettingsSection => {
  const childFields = createChildFields(group, prefix);

  const children = group.children?.length ? group.children.map((child) => resolveSandboxSection(child, prefix)) : [];

  return formSection({
    label: group.name,
    fields: [
      ...(childFields.length
        ? [
            {
              key: group.name,
              description: group.name,
              fields: [...childFields],
            },
          ]
        : []),

      ...children,
    ],
  });
};
