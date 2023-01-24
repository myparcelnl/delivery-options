import { ADDRESS, MYPARCEL, SENDMYPARCEL, STRINGS } from '@myparcel/delivery-options';
import CCountrySelect from '../../components/form/CCountrySelect.vue';
import CNumber from '../../components/form/CNumber.vue';

/**
 * @param {MyParcel.Platform} platform
 *
 * @returns {Array}
 */
function getForm(platform) {
  const forPlatforms = (platforms, settings) => {
    return platforms.includes(platform) ? [settings] : [];
  };

  return {
    title: 'Address',
    description: 'address',
    settings: [
      {
        key: ADDRESS.KEY,
        name: ADDRESS.CC,
        component: CCountrySelect,
        props: {
          label: STRINGS.CC,
        },
      },
      {
        key: ADDRESS.KEY,
        name: ADDRESS.POSTAL_CODE,
        props: {
          label: STRINGS.POSTAL_CODE,
          autocomplete: 'postal-code',
        },
      },
      ...forPlatforms([MYPARCEL], {
        key: ADDRESS.KEY,
        name: ADDRESS.NUMBER,
        component: CNumber,
        props: {
          label: STRINGS.NUMBER,
          min: 1,
        },
      }),
      ...forPlatforms([SENDMYPARCEL], {
        key: ADDRESS.KEY,
        name: ADDRESS.CITY,
        props: {
          label: STRINGS.CITY,
          autocomplete: 'address-level2',
        },
      }),
    ],
  };
}

export default {
  [MYPARCEL]: getForm(MYPARCEL),
  [SENDMYPARCEL]: getForm(SENDMYPARCEL),
};
