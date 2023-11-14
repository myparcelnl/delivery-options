import {CONFIG, getCarrierConfiguration, KEY_CONFIG} from '@myparcel-do/shared';
import {sandboxConfigBus} from '../sandboxConfigBus';

/**
 * Transform a given setting into a form setting entry. Item is not processed if it's not allowed in given platform.
 *
 * @param {Object} setting - Setting to transform.
 * @param {MyParcel.Platform} platform
 *
 * @returns {Object[][]}
 */
export function carrierSetting(setting, platform) {
  return sandboxConfigBus.carrierData.reduce((acc, carrier) => {
    let currentCarrierConfig;

    try {
      currentCarrierConfig = getCarrierConfiguration(carrier.name, platform);
    } catch (e) {
      /*
       * Should not be caught. This will fail in the sandbox if carriers exist in the api which we don't support, and
       * that's fine.
       */
      return acc;
    }

    const allowedInCarrier = currentCarrierConfig.hasFeature(setting.name);

    if (!allowedInCarrier) {
      return acc;
    }

    return [
      ...acc,
      {
        ...setting,
        key: `${KEY_CONFIG}.${CONFIG.CARRIER_SETTINGS}.${carrier.identifier}`,
        carrier: {
          name: carrier.identifier,
          text: carrier.label,
          image: carrier.image,
        },
      },
    ];
  }, []);
}
