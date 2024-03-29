import {isEnumValue} from '@myparcel/ts-utils';
import {getAllConfigOptions, getDefaultValueForType} from '../utils';
import {type CarrierSettings} from '../types';
import {CarrierSetting} from './enums';

export const getDefaultCarrierSettings = (): CarrierSettings => {
  const allOptions = getAllConfigOptions();

  return Object.fromEntries(
    allOptions
      .filter((option) => isEnumValue(option.key, CarrierSetting))
      .map((option) => [option.key, getDefaultValueForType(option.type)]),
  );
};
