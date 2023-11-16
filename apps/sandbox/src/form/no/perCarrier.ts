import {type AnyElementConfiguration} from '@myparcel/vue-form-builder';
import {toArray} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {type SettingsField} from '../../types/form.types';
import {convertToFields} from './convertToFields';

export const perCarrier = <I extends AnyElementConfiguration>(input: I): SettingsField[] => {
  const modified = toArray(input).reduce((acc, item) => {
    Object.values(CarrierName).forEach((carrier) => {
      if (item.name) {
        acc.push({
          ...item,
          name: `${carrier}.${item.name}`,
          props: {
            carrier,
          },
        });
      } else {
        acc.push(item);
      }
    });

    return acc;
  }, []);

  return convertToFields(modified);
};
