import {ALL_STRINGS, KEY_STRINGS, OptionGroup} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import {resolveSandboxSection} from './resolveSandboxSection';

export const getStringsSandboxSections = (): SettingsSection[] => {
  return [
    {
      name: OptionGroup.Strings,
      items: ALL_STRINGS,
    },
  ].map((group) => resolveSandboxSection(group, KEY_STRINGS));
};
