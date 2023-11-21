import {type CarrierSetting, type ConfigSetting} from '@myparcel-do/shared';
import {type AnyElementConfiguration, type ModularCreatedField} from '@myparcel/vue-form-builder';

export interface SettingsSection {
  description?: string;
  fields: (SettingsField | SettingsGroup | SettingsSection)[];
  label: string;
}

export interface SettingsGroup {
  description?: string;
  fields: SettingsField[];
  hasCarrierToggle?: boolean;
  key: string;
  needs?: string[];
}

export type SettingsField = ModularCreatedField;

export type FieldOrSection = (SettingsField | AnyElementConfiguration) | SettingsSection;

export type ResolvedFieldOrSection<T extends FieldOrSection> = T extends AnyElementConfiguration ? SettingsField : T;

export interface SandboxOptionGroup {
  children?: SandboxOptionGroup[];
  items?: (CarrierSetting | ConfigSetting)[];
  label?: string;
  name: OptionGroup | string;
}
