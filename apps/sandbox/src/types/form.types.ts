import {type AnyConfigKey} from '@myparcel-do/shared';
import {type AnyElementConfiguration, type ModularCreatedField} from '@myparcel/vue-form-builder';
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

export type SettingsField = ModularCreatedField;

export type FieldOrSection = (SettingsField | AnyElementConfiguration) | SettingsSection;

export type ResolvedFieldOrSection<T extends FieldOrSection> = T extends AnyElementConfiguration ? SettingsField : T;

export interface SandboxOptionGroup {
  children?: SandboxOptionGroup[];
  hasExpand?: boolean;
  items?: ReadonlyOr<(AnyConfigKey | string)[]>;
  label?: string;
  name: string;
  perCarrier?: boolean;
}
