/* eslint-disable no-console */
import {CarrierSetting, ConfigSetting, KEY_CARRIER_SETTINGS} from '@myparcel-dev/shared';
import {type ReadonlyOr} from '@myparcel/ts-utils';
import {CarrierName, PlatformName} from '@myparcel-dev/constants';
import {type IncomingEventDetail} from '../types/events.types';
import {RENDER_DELIVERY_OPTIONS} from '../data';
import {getDefaultAddress} from './getDefaultAddress';

const JSON_SPACES = 2;

const lineHeight = 'line-height: 2em';
const sansSerif = 'font-family: sans-serif';
const padding = 'padding: 0 0.5em';
const margin = 'margin: 2px 0';

const h1 = Object.freeze(['font-size: 2em', sansSerif, lineHeight]);

const h2 = Object.freeze([
  'font-size: 1.4em',
  'border-bottom: 1px solid #ff8c00',
  sansSerif,
  lineHeight,
  padding,
  margin,
]);

const text = Object.freeze([
  'font-size: 1.2em',
  'background-color: #ff8c00',
  'color: #222',
  'border-radius: 0.5em',
  sansSerif,
  lineHeight,
  padding,
  margin,
]);

const code = ['font-family: monospace'];

/**
 * Output some information in the console to help a developer get started quickly.
 */
export const showDeveloperInfo = (): void => {
  const demoConfig = {
    selector: `#${__CLASS_BASE__}`,
    config: {
      [ConfigSetting.Platform]: PlatformName.MyParcel,
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowPickupLocations]: true,
        },
        [CarrierName.DhlForYou]: {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowPickupLocations]: true,
        },
      },
    },
    address: getDefaultAddress(),
  } satisfies IncomingEventDetail;

  const log = (message: string, style: ReadonlyOr<string[]>): void => {
    console.log(`%c${message}`, style.join(';'));
  };

  log('Welcome to the MyParcel delivery options!', h1);
  log(
    `Documentation: ${__URL_DOCUMENTATION__}
Sandbox: ${__URL_SANDBOX__}`,
    h2,
  );

  log(
    `By default, the delivery options are not rendered.
To show it you must pass a configuration via an event:`,
    text,
  );

  const configJson = JSON.stringify({detail: demoConfig}, null, JSON_SPACES).replace(/"([^"]+)":/g, '$1:');

  log(
    `const event = new CustomEvent('${RENDER_DELIVERY_OPTIONS}', ${configJson});

document.dispatchEvent(event);`,
    code,
  );

  log(
    `This example shows a checkout with delivery options and pickup locations enabled for ${CarrierName.PostNl} and ${CarrierName.DhlForYou}.
⬇ You can try it right here in your browser console. ⬇`,
    text,
  );
  /* eslint-enable no-console */
};
