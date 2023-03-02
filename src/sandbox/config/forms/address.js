import * as ADDRESS from '@/data/keys/addressKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import CCountrySelect from '@/sandbox/components/form/CCountrySelect';
import CTextInput from '@/sandbox/components/form/CTextInput.vue';

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
          autocomplete: 'country',
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
      {
        key: ADDRESS.KEY,
        name: ADDRESS.STREET,
        component: CTextInput,
        props: {
          label: STRINGS.STREET,
          autocomplete: 'address-line1',
        },
      },
      {
        key: ADDRESS.KEY,
        name: ADDRESS.CITY,
        props: {
          label: STRINGS.CITY,
          autocomplete: 'address-level2',
        },
      },
    ],
  };
}

export default {
  [MYPARCEL]: getForm(MYPARCEL),
  [SENDMYPARCEL]: getForm(SENDMYPARCEL),
};
