import {KEY_CONFIG} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import {resolveSandboxGroup} from './resolveSandboxGroup';
import {getSandboxOptionGroups} from './getSandboxOptionGroups';

export const getConfigurationSections = (prefix?: string): SettingsSection[] => {
  const groups = getSandboxOptionGroups();

  return groups.map((group) => resolveSandboxGroup(group, KEY_CONFIG + (prefix ? `.${prefix}` : '')));
};
