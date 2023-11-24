import {isOfType} from '@myparcel/ts-utils';
import {type SandboxOptionGroup, type SettingsGroup} from '../types';
import {createChildFields} from './createChildFields';

export const createChildSections = (group: SandboxOptionGroup): SettingsGroup[] => {
  return (group.children ?? []).map((child) => {
    return {
      key: child.name,
      fields: isOfType<SandboxOptionGroup>(child, 'items') ? createChildSections(child) : createChildFields(child),
    };
  });
};
