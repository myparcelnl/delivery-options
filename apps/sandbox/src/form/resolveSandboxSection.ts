import {type SandboxOptionGroup, type SettingsSection} from '../types';
import {formSection} from './formSection';
import {createChildFields} from './createChildFields';
import type { CarrierIdentifier } from '@myparcel-dev/do-shared';

export const resolveSandboxSection = (group: SandboxOptionGroup, carrierName: CarrierIdentifier): SettingsSection => {
  const childFields = createChildFields(group, carrierName);

  const children = group.children?.length ? group.children.map((child) => resolveSandboxSection(child, carrierName)) : [];

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
