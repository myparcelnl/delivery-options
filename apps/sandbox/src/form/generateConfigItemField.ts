import {reactive, ref, toValue} from 'vue';
import {type CarrierConfiguration} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import {getCarrierSettingsKey} from '../utils';
import {type SettingsField} from '../types';

export const generateConfigItemField = (item: SettingsField, carrier: CarrierConfiguration) => {
  return createField({
    ...item.field,
    ref: ref(toValue(item.field.ref)),
    name: getCarrierSettingsKey(item.field.name, carrier.name),
    label: `${item.field.label} (${carrier.name})`,
    props: reactive({
      ...item.field.props,
      carrier: carrier.name,
      parentField: item.field.name,
    }),

    visibleWhen: (field) => {
      if (!field.name) {
        return true;
      }

      const parents = (field.props.parents ?? []) as string[];

      if (!parents.length) {
        return true;
      }

      return parents
        .map((string) => field.name.replace(/[^.]+$/, string))
        .every((parent) => {
          try {
            return field.form.getValue(parent);
          } catch (e) {
            return false;
          }
        });
    },
  });
};
