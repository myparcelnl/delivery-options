import {CONFIG, CONSTS, KEY_CONFIG} from '@myparcel-do/shared';
import {formField} from '../formField';
import TimeInput from '../components/form/FormTimeInput.vue';
import NumberInput from '../components/form/FormNumberInput.vue';
import CheckboxGroupInput from '../components/form/FormCheckboxGroupInput.vue';
import {perCarrier} from './perCarrier';
import {ifAnyCarrierAllows} from './ifAnyCarrierAllows';
import {formGroup} from './formGroup';

export const getDropOffFields = () => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return [
    formGroup({
      label: CONFIG.DROP_OFF_DAYS,
      fields: [
        ...perCarrier({
          key: KEY_CONFIG,
          name: CONFIG.DROP_OFF_DAYS,
          component: CheckboxGroupInput,
          props: {
            // Map the weekdays to options. If the day is sunday set index to 0.
            options: weekdays.map((day, index) => ({
              value: index === weekdays.length - 1 ? 0 : index + 1,
              label: day,
            })),
            // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
          },
        }),
      ],
    }),

    formField({
      key: KEY_CONFIG,
      name: CONFIG.DELIVERY_DAYS_WINDOW,
      component: NumberInput,
      props: {
        min: 1,
        max: 14,
      },
    }),

    formGroup({
      label: CONFIG.DROP_OFF_DELAY,
      fields: [
        ...perCarrier({
          key: KEY_CONFIG,
          name: CONFIG.DROP_OFF_DELAY,
          component: NumberInput,
          props: {
            min: CONSTS.DROP_OFF_DELAY_MIN,
            max: CONSTS.DROP_OFF_DELAY_MAX,
          },
          // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
        }),
      ],
    }),

    formGroup({
      label: CONFIG.CUTOFF_TIME,
      fields: [
        ...perCarrier({
          key: KEY_CONFIG,
          name: CONFIG.CUTOFF_TIME,
          component: TimeInput,
          // conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
        }),

        ...ifAnyCarrierAllows(
          CONFIG.ALLOW_SAME_DAY_DELIVERY,
          perCarrier({
            key: KEY_CONFIG,
            name: CONFIG.CUTOFF_TIME_SAME_DAY,
            component: TimeInput,
            // conditions: [CONFIG.ALLOW_SAME_DAY_DELIVERY],
          }),
        ),
      ],
    }),
  ];
};
