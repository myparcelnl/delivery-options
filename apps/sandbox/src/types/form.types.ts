import {type ModularCreatedField} from '@myparcel/vue-form-builder';

export interface SettingsSection {
  description?: string;
  fields: (SettingsField | SettingsGroup)[];
  label: string;
}

export interface SettingsGroup {
  description?: string;
  fields: SettingsField[];
  label: string;
}

export type SettingsField = ModularCreatedField;
