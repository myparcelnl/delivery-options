import {KEY_ADDRESS, STRINGS} from '@myparcel-do/shared';

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
        key: KEY_ADDRESS,
        name: AddressField.Cc,
        component: CCountrySelect,
        props: {
          label: STRINGS.CC,
          autocomplete: 'country',
        },
      },
      {
        key: KEY_ADDRESS,
        name: AddressField.PostalCode,
        props: {
          label: STRINGS.POSTAL_CODE,
          autocomplete: 'postal-code',
        },
      },
      {
        key: KEY_ADDRESS,
        name: AddressField.Street,
        component: CTextInput,
        props: {
          label: STRINGS.STREET,
          autocomplete: 'address-line1',
        },
      },
      {
        key: KEY_ADDRESS,
        name: ADDRESS_CITY,
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
