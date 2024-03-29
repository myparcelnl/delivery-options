import * as CONFIG from '@/data/keys/configKeys';
import * as CONSTS from '@/data/keys/settingsConsts';
import * as FORM from '@/config/formConfig';
import * as STRINGS from '@/data/keys/stringsKeys';
import CCheckboxGroup from '@/sandbox/components/form/CCheckboxGroup';
import CCurrency from '@/sandbox/components/form/CCurrency';
import CNumber from '@/sandbox/components/form/CNumber';
import CSelect from '@/sandbox/components/form/CSelect';
import CTimepicker from '@/sandbox/components/form/CTimepicker';
import CToggle from '@/sandbox/components/form/CToggle';
import { GENERAL } from '@/sandbox/settings';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { allowedInAnyCarrier } from '@/sandbox/settings/conditions/allowedInAnyCarrier';
import { carrierSetting } from '@/sandbox/settings/carrierSetting';
import { featuresForm } from '@/sandbox/settings/formParts/featuresForm';
import { getWeekdays } from '@/helpers/getWeekdays';
import { i18n } from '@/sandbox/services/vue-i18n';
import { inAnyCarrier } from '@/sandbox/settings/conditions/inAnyCarrier';
import memoize from 'lodash-es/memoize';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';
import { stringsForm } from '@/sandbox/settings/formParts/stringForm';

const currencyProps = {
  symbol: sandboxConfigBus.getSetting(CONFIG.KEY, CONFIG.CURRENCY) || '€',
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
export const createSettings = memoize((platform) => {
  const perCarrier = (data) => carrierSetting(data, platform);
  const ifAnyCarrierAllows = (setting, data) => allowedInAnyCarrier(setting, data, platform);

  /**
   * SendMyParcel doesn't allow delivery days window right now.
   */
  const deliveryDaysWindow = platform === SENDMYPARCEL
    ? []
    : [
      {
        key: CONFIG.KEY,
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
          key: CONFIG.KEY,
          name: CONFIG.SHOW_PRICES,
          component: CToggle,
        },
        {
          key: CONFIG.KEY,
          name: CONFIG.CURRENCY,
          conditions: [
            CONFIG.SHOW_PRICES,
          ],
        },
        {
          key: CONFIG.KEY,
          name: CONFIG.SHOW_PRICE_SURCHARGE,
          component: CToggle,
          conditions: [
            CONFIG.SHOW_PRICES,
          ],
        },
      ],
    },
    {
      title: FORM.DELIVERY,
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
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
          ],
        },
        {
          title: FORM.DELIVERY_STANDARD,
          settings: [
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_STANDARD_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
              ],
            },
            {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_STANDARD_DELIVERY,
              component: CCurrency,
              conditions: [
                CONFIG.SHOW_PRICES,
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
              ],
              props: currencyProps,
            },
          ],
        },
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SAME_DAY_DELIVERY, {
          title: FORM.DELIVERY_SAME_DAY,
          settings: [
            ...perCarrier({
              key: CONFIG.KEY,
              name: CONFIG.ALLOW_SAME_DAY_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
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
          title: FORM.DELIVERY_MORNING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MORNING_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_MORNING_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY),
              ],
            },
            {
              key: CONFIG.KEY,
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
          title: FORM.DELIVERY_EVENING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_EVENING_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_EVENING_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY),
              ],
            },
            {
              key: CONFIG.KEY,
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
          title: FORM.MONDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MONDAY_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
              name: CONFIG.SATURDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MONDAY_DELIVERY),
              ],
            },
            {
              key: CONFIG.KEY,
              name: CONFIG.SUNDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MONDAY_DELIVERY),
              ],
            },
          ],
        }),
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SATURDAY_DELIVERY, {
          title: FORM.SATURDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_SATURDAY_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
              name: CONFIG.FRIDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_SATURDAY_DELIVERY),
              ],
            },
          ],
        }),
        {
          title: FORM.SHIPMENT_OPTIONS,
          settings: [
            ...ifAnyCarrierAllows(CONFIG.ALLOW_ONLY_RECIPIENT, {
              title: FORM.ONLY_RECIPIENT,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_ONLY_RECIPIENT,
                  component: CToggle,
                  conditions: [
                    CONFIG.ALLOW_DELIVERY_OPTIONS,
                  ],
                }),
                {
                  key: STRINGS.KEY,
                  name: STRINGS.ONLY_RECIPIENT_TITLE,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT),
                  ],
                },
                {
                  key: CONFIG.KEY,
                  name: CONFIG.PRICE_ONLY_RECIPIENT,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [
                    CONFIG.SHOW_PRICES,
                    inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT),
                  ],
                },
              ],
            }),
            ...ifAnyCarrierAllows(CONFIG.ALLOW_SIGNATURE, {
              title: FORM.SIGNATURE,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_SIGNATURE,
                  component: CToggle,
                  conditions: [
                    CONFIG.ALLOW_DELIVERY_OPTIONS,
                  ],
                }),
                {
                  key: STRINGS.KEY,
                  name: STRINGS.SIGNATURE_TITLE,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_SIGNATURE),
                  ],
                },
                {
                  key: CONFIG.KEY,
                  name: CONFIG.PRICE_SIGNATURE,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [
                    CONFIG.SHOW_PRICES,
                    inAnyCarrier(CONFIG.ALLOW_SIGNATURE),
                  ],
                },
              ],
            }),
          ],
        },
        ...ifAnyCarrierAllows([
          CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
          CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
        ], {
          title: FORM.PACKAGE_TYPE,
          settings: [
            {
              key: CONFIG.KEY,
              name: CONFIG.PACKAGE_TYPE,
              component: CSelect,
              props: {
                options: CONSTS.PACKAGE_TYPE_OPTIONS,
              },
            },
            ...ifAnyCarrierAllows(CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
              component: CCurrency,
              props: currencyProps,
              conditions: [
                CONFIG.SHOW_PRICES,
              ],
            }),
            ...ifAnyCarrierAllows(CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX, {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_PACKAGE_TYPE_MAILBOX,
              component: CCurrency,
              props: currencyProps,
              conditions: [
                CONFIG.SHOW_PRICES,
              ],
            }),
          ],
        }),
      ],
    },
    {
      title: FORM.PICKUP,
      settings: [
        ...perCarrier({
          name: CONFIG.ALLOW_PICKUP_LOCATIONS,
          component: CToggle,
        }),
        {
          key: STRINGS.KEY,
          name: STRINGS.PICKUP_TITLE,
          conditions: [
            inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
          ],
        },
        {
          key: CONFIG.KEY,
          name: CONFIG.PRICE_PICKUP,
          component: CCurrency,
          props: currencyProps,
          conditions: [
            CONFIG.SHOW_PRICES,
            inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
          ],
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
              key: CONFIG.KEY,
              name: CONFIG.DROP_OFF_DAYS,
              component: CCheckboxGroup,
              props: {
                // Map the weekdays to options. If the day is sunday set index to 0.
                options: weekdays.map((day, index) => ({
                  value: index === weekdays.length - 1 ? 0 : index + 1,
                  text: day,
                })),
                conditions: [
                  CONFIG.ALLOW_DELIVERY_OPTIONS,
                ],
              },
            }),
          ],
        },
        ...deliveryDaysWindow,
        {
          title: CONFIG.DROP_OFF_DELAY,
          settings: [
            ...perCarrier({
              key: CONFIG.KEY,
              name: CONFIG.DROP_OFF_DELAY,
              component: CNumber,
              props: {
                min: CONSTS.DROP_OFF_DELAY_MIN,
                max: CONSTS.DROP_OFF_DELAY_MAX,
              },
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
          ],
        },
        {
          title: CONFIG.CUTOFF_TIME,
          settings: [
            ...perCarrier({
              key: CONFIG.KEY,
              name: CONFIG.CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
          ],
        },
        ...ifAnyCarrierAllows(CONFIG.ALLOW_SAME_DAY_DELIVERY, {
          title: CONFIG.CUTOFF_TIME_SAME_DAY,
          settings: [
            ...perCarrier({
              key: CONFIG.KEY,
              name: CONFIG.CUTOFF_TIME_SAME_DAY,
              component: CTimepicker,
              conditions: [
                CONFIG.ALLOW_SAME_DAY_DELIVERY,
              ],
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
      title: STRINGS.KEY,
      settings: stringsForm,
    },
  ];
});
