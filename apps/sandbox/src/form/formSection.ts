import {type SettingsSection, type SettingsGroup} from '../types';

export const formSection = <I extends SettingsSection | SettingsGroup>(input: I): I => input;
