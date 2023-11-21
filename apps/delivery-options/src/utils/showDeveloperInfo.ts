/* eslint-disable no-console */
import {
  AddressField,
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_PICKUP_LOCATIONS,
  CARRIER_SETTINGS,
  type InputDeliveryOptionsConfiguration,
  PLATFORM,
  UPDATE_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

/**
 * Output some information in the console to help a developer get started quickly.
 */
export const showDeveloperInfo = () => {
  const styleHeader1 = ['font-size: 2em', 'font-family: sans-serif', 'padding: .2em 0;'];

  const styleHeader2 = [
    'color: gray',
    'font-size: 1.4em',
    'font-style: italic',
    'font-family: sans-serif',
    'padding: .2em 0;',
  ];

  const styleText = [
    'color: white',
    'font-size: 1.2em',
    'font-family: sans-serif',
    'padding: .2em .3em;',
    'background-color: #51B67D',
    'border-radius: 3px',
    'margin: .1em 0',
    'border-left: 3px solid #14785A',
  ];

  const styleCode = ['padding: .2em 0;'];

  const demoConfig = {
    config: {
      [PLATFORM]: PlatformName.MyParcel,
      [CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [ALLOW_DELIVERY_OPTIONS]: true,
          [ALLOW_PICKUP_LOCATIONS]: true,
        },
      },
    },
    address: {
      [AddressField.Cc]: '',
      [AddressField.City]: '',
      [AddressField.PostalCode]: '',
      [AddressField.Street]: '',
    },
  } satisfies Omit<InputDeliveryOptionsConfiguration, 'components'>;

  console.log('%cWelcome to the MyParcel delivery options!', styleHeader1.join(';'));
  console.log('%cCheck out README.md for the full documentation.', styleHeader2.join(';'));
  console.log(
    '%cBy default, the delivery options are not visible. \n' +
      'To show it you must fill window.MyParcelConfig with the following data:',
    styleText.join(';'),
  );
  console.log(`%cwindow.MyParcelConfig = ${JSON.stringify(demoConfig, null, 2)}`, styleCode.join(';'));
  console.log('%cAnd then send an event to tell the delivery options module to update its data:', styleText.join(';'));
  console.log(`%cdocument.dispatchEvent(new Event('${UPDATE_DELIVERY_OPTIONS}'));`, styleCode.join(';'));
  console.log(
    '%cThis example shows a checkout with delivery options and pickup locations enabled for both bpost and dpd. ' +
      'Check out the readme for all possible settings combinations.\n' +
      '⬇ You can try it right here in your browser console. ⬇',
    styleText.join(';'),
  );
  /* eslint-enable no-console */
};
