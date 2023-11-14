import {useMemoize} from '@vueuse/core';
import {
  CONFIG,
  CONSTS,
  KEY_CONFIG,
  KEY_STRINGS,
  PACKAGE_TYPE,
  PICKUP,
  SENDMYPARCEL,
  STRINGS,
} from '@myparcel-do/shared';
import {GENERAL} from '../settings';
import {i18n} from '../services/vue-i18n';
import {sandboxConfigBus} from '../sandboxConfigBus';
import CToggle from '../components/form/CToggle.vue';
import CTimepicker from '../components/form/CTimepicker.vue';
import CSelect from '../components/form/CSelect.vue';
import CNumber from '../components/form/CNumber.vue';
import CCurrency from '../components/form/CCurrency.vue';
import {stringsForm} from './formParts/stringForm';
import {featuresForm} from './formParts/featuresForm';
import {inAnyCarrier} from './conditions/inAnyCarrier';
import {allowedInAnyCarrier} from './conditions/allowedInAnyCarrier';
import {carrierSetting} from './carrierSetting';

const currencyProps = {
  symbol: sandboxConfigBus.getSetting(KEY_CONFIG, CONFIG.CURRENCY) || '€',
};

const weekdays = getWeekdays(i18n.locale);

/**
 * Settings and their default values.
 *
 * @param {MyParcel.Platform} platform - Platform to get settings for.
 *
 * @returns {Array}
 */
// eslint-disable-next-line max-lines-per-function
export const createSettings = useMemoize((platform) => {
  const perCarrier = (data) => carrierSetting(data, platform);
  const ifAnyCarrierAllows = (setting, data) => allowedInAnyCarrier(setting, data, platform);

  /**
   * SendMyParcel doesn't allow delivery days window right now.
   */
  const deliveryDaysWindow =
    platform === SENDMYPARCEL
      ? []
      : [
          {
            key: KEY_CONFIG,
            name: CONFIG.DELIVERY_DAYS_WINDOW,
            component: CNumber,
            props: {
              min: 1,
              max: 14,
            },
          },
        ];

  return [
    {
      title: GENERAL,
      description: 'general',
      settings: [
        {
          key: KEY_CONFIG,
          name: CONFIG.SHOW_PRICES,
          component: CToggle,
        },
        {
          key: KEY_CONFIG,
          name: CONFIG.CURRENCY,
          conditions: [CONFIG.SHOW_PRICES],
        },
        {
          key: KEY_CONFIG,
          name: CONFIG.SHOW_PRICE_SURCHARGE,
          component: CToggle,
          conditions: [CONFIG.SHOW_PRICES],
        },
      ],
    },
    {
      title: DELIVERY,
      settings: [
        ...perCarrier({
          name: CONFIG.ALLOW_DELIVERY_OPTIONS,
          component: CToggle,
        }),
        {
          title: CONFIG.FEATURE_SHOW_DELIVERY_DATE,
          settings: [
            ...perCarrier({
              name: CONFIG.FEATURE_SHOW_DELIVERY_DATE,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
          ],
        },
        {
          title: DELIVERY_STANDARD,
          settings: [
            {
              key: KEY_STRINGS,
              name: STRINGS.DELIVERY_STANDARD_TITLE,
              conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS)],
            },
            {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_STANDARD_DELIVERY,
              component: CCurrency,
              conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS)],
              props: currencyProps,
            },
          ],
        },
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SAME_DAY_DELIVERY, {
          title: DELIVERY_SAME_DAY,
          settings: [
            ...perCarrier({
              key: KEY_CONFIG,
              name: CONFIG.ALLOW_SAME_DAY_DELIVERY,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_SAME_DAY_DELIVERY,
              component: CCurrency,
              conditions: [
                CONFIG.SHOW_PRICES,
                CONFIG.ALLOW_DELIVERY_OPTIONS,
                inAnyCarrier(CONFIG.ALLOW_SAME_DAY_DELIVERY),
              ],
              props: currencyProps,
            },
          ],
        }),
        ...ifAnyCarrierAllows(CONFIG.ALLOW_MORNING_DELIVERY, {
          title: DELIVERY_MORNING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MORNING_DELIVERY,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            {
              key: KEY_STRINGS,
              name: STRINGS.DELIVERY_MORNING_TITLE,
              conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS), inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY)],
            },
            {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_MORNING_DELIVERY,
              component: CCurrency,
              conditions: [
                CONFIG.SHOW_PRICES,
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY),
              ],
              props: currencyProps,
            },
          ],
        }),
        ...ifAnyCarrierAllows(CONFIG.ALLOW_EVENING_DELIVERY, {
          title: DELIVERY_EVENING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_EVENING_DELIVERY,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            {
              key: KEY_STRINGS,
              name: STRINGS.DELIVERY_EVENING_TITLE,
              conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS), inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY)],
            },
            {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_EVENING_DELIVERY,
              component: CCurrency,
              conditions: [
                CONFIG.SHOW_PRICES,
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY),
              ],
              props: currencyProps,
            },
          ],
        }),
        ...ifAnyCarrierAllows(CONFIG.ALLOW_MONDAY_DELIVERY, {
          title: MONDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MONDAY_DELIVERY,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            {
              key: KEY_CONFIG,
              name: CONFIG.SATURDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS), inAnyCarrier(CONFIG.ALLOW_MONDAY_DELIVERY)],
            },
          ],
        }),
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SATURDAY_DELIVERY, {
          title: SATURDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_SATURDAY_DELIVERY,
              component: CToggle,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
            {
              key: KEY_CONFIG,
              name: CONFIG.FRIDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS), inAnyCarrier(CONFIG.ALLOW_SATURDAY_DELIVERY)],
            },
          ],
        }),
        {
          title: SHIPMENT_OPTIONS,
          settings: [
            ...ifAnyCarrierAllows(CONFIG.ALLOW_ONLY_RECIPIENT, {
              title: ONLY_RECIPIENT,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_ONLY_RECIPIENT,
                  component: CToggle,
                  conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
                }),
                {
                  key: KEY_STRINGS,
                  name: STRINGS.ONLY_RECIPIENT_TITLE,
                  conditions: [inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT)],
                },
                {
                  key: KEY_CONFIG,
                  name: CONFIG.PRICE_ONLY_RECIPIENT,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT)],
                },
              ],
            }),
            ...ifAnyCarrierAllows(CONFIG.ALLOW_SIGNATURE, {
              title: SIGNATURE,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_SIGNATURE,
                  component: CToggle,
                  conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
                }),
                {
                  key: KEY_STRINGS,
                  name: STRINGS.SIGNATURE_TITLE,
                  conditions: [inAnyCarrier(CONFIG.ALLOW_SIGNATURE)],
                },
                {
                  key: KEY_CONFIG,
                  name: CONFIG.PRICE_SIGNATURE,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_SIGNATURE)],
                },
              ],
            }),
          ],
        },
        ...ifAnyCarrierAllows([CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX], {
          title: PACKAGE_TYPE,
          settings: [
            {
              key: KEY_CONFIG,
              name: CONFIG.PACKAGE_TYPE,
              component: CSelect,
              props: {
                options: CONSTS.PACKAGE_TYPE_OPTIONS,
              },
            },
            ...ifAnyCarrierAllows(CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
              component: CCurrency,
              props: currencyProps,
              conditions: [CONFIG.SHOW_PRICES],
            }),
            ...ifAnyCarrierAllows(CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX, {
              key: KEY_CONFIG,
              name: CONFIG.PRICE_PACKAGE_TYPE_MAILBOX,
              component: CCurrency,
              props: currencyProps,
              conditions: [CONFIG.SHOW_PRICES],
            }),
          ],
        }),
      ],
    },
    {
      title: PICKUP,
      settings: [
        ...perCarrier({
          name: CONFIG.ALLOW_PICKUP_LOCATIONS,
          component: CToggle,
        }),
        {
          key: KEY_STRINGS,
          name: STRINGS.PICKUP_TITLE,
          conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
        },
        {
          key: KEY_CONFIG,
          name: CONFIG.PRICE_PICKUP,
          component: CCurrency,
          props: currencyProps,
          conditions: [CONFIG.SHOW_PRICES, inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
        },
      ],
    },
    {
      title: 'dropoff',
      description: 'dropoff',
      settings: [
        {
          title: CONFIG.DROP_OFF_DAYS,
          settings: [
            ...perCarrier({
              key: KEY_CONFIG,
              name: CONFIG.DROP_OFF_DAYS,
              component: CCheckboxGroup,
              props: {
                // Map the weekdays to options. If the day is sunday set index to 0.
                options: weekdays.map((day, index) => ({
                  value: index === weekdays.length - 1 ? 0 : index + 1,
                  text: day,
                })),
                conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
              },
            }),
          ],
        },
        ...deliveryDaysWindow,
        {
          title: CONFIG.DROP_OFF_DELAY,
          settings: [
            ...perCarrier({
              key: KEY_CONFIG,
              name: CONFIG.DROP_OFF_DELAY,
              component: CNumber,
              props: {
                min: CONSTS.DROP_OFF_DELAY_MIN,
                max: CONSTS.DROP_OFF_DELAY_MAX,
              },
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
          ],
        },
        {
          title: CONFIG.CUTOFF_TIME,
          settings: [
            ...perCarrier({
              key: KEY_CONFIG,
              name: CONFIG.CUTOFF_TIME,
              component: CTimepicker,
              conditions: [CONFIG.ALLOW_DELIVERY_OPTIONS],
            }),
          ],
        },
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SAME_DAY_DELIVERY, {
          title: CONFIG.CUTOFF_TIME_SAME_DAY,
          settings: [
            ...perCarrier({
              key: KEY_CONFIG,
              name: CONFIG.CUTOFF_TIME_SAME_DAY,
              component: CTimepicker,
              conditions: [CONFIG.ALLOW_SAME_DAY_DELIVERY],
            }),
          ],
        }),
      ],
    },
    {
      title: 'features',
      description: 'features',
      settings: featuresForm,
    },
    {
      title: KEY_STRINGS,
      settings: stringsForm,
    },
  ];
});
