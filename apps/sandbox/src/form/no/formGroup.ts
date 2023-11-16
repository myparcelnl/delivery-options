import {type SettingsGroup} from '../../types/form.types';

export const formGroup = (input: Omit<SettingsGroup, 'component'>): SettingsGroup => {
  return {...input};
};
