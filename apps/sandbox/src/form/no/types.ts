import {type AnyElementConfiguration} from '@myparcel/vue-form-builder';
import {type SettingsField} from '../../types/form.types';
import {type SettingsSection} from '../../types';

export type FieldOrSection = (SettingsField | AnyElementConfiguration) | SettingsSection;

export type ResolvedFieldOrSection<T extends FieldOrSection> = T extends AnyElementConfiguration ? SettingsField : T;
