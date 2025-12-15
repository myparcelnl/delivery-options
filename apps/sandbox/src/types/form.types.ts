import {type ConfigKey} from '@myparcel-dev/shared';
import {type ModularCreatedElement} from '@myparcel/vue-form-builder';
import {type ReadonlyOr} from '@myparcel/ts-utils';

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

export type SettingsField = ModularCreatedElement;

export interface SandboxOptionGroup {
  children?: SandboxOptionGroup[];
  hasExpand?: boolean;
  items?: ReadonlyOr<(ConfigKey | string | ModularCreatedElement)[]>;
  label?: string;
  name: string;
  perCarrier?: boolean;
}
