import {type ConfigKey} from '@myparcel-dev/do-shared';
import {type ReadonlyOr} from '@myparcel-dev/ts-utils';
import {type SandboxConfigOption} from '../form/getAllSandboxConfigOptions';

export interface SettingsSection {
  description?: string;
  fields: (SettingsField | SettingsGroup | SettingsSection)[];
  label: string;
}

export interface SettingsGroup {
  description?: string;
  fields?: SettingsField[];
  key: string;
  needs?: string[];
  perCarrier?: boolean;
}

export type SettingsField = SandboxConfigOption;

export interface SandboxOptionGroup {
  children?: SandboxOptionGroup[];
  hasExpand?: boolean;
  items?: ReadonlyOr<(ConfigKey | string | SandboxConfigOption)[]>;
  label?: string;
  name: string;
  perCarrier?: boolean;
}
