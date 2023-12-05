import {type SettingsSection} from '../types';
import {getConfigSandboxSections} from './getConfigSandboxSections';
import {formSection} from './formSection';

export const getSandboxConfigurationGroups = (): SettingsSection[] => {
  return [
    formSection({
      label: 'config',
      fields: getConfigSandboxSections(),
    }),
  ];
};
