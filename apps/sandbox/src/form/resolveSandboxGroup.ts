import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {formSection} from './formSection';
import {createChildFields} from './createChildFields';

export const resolveSandboxGroup = (group: SandboxOptionGroup, prefix: string): SettingsSection => {
  const childFields = createChildFields(group, prefix);

  const children = group.children?.length ? group.children.map((child) => resolveSandboxGroup(child, prefix)) : [];
  const finalFields = [...childFields];

  return formSection({
    label: group.name,
    fields: [
      ...(finalFields.length
        ? [
            {
              key: group.name,
              description: group.name,
              fields: finalFields,
            },
          ]
        : []),

      ...(children.length
        ? [
            formSection({
              label: group.name,
              fields: children,
            }),
          ]
        : []),
    ],
  });
};
