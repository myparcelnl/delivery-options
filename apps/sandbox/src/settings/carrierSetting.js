import {CONFIG} from '@myparcel/delivery-options';
import { CarrierConfigurationFactory } from '../../delivery-options/src/data/carriers/carrierConfigurationFactory';
import { sandboxConfigBus } from '../../delivery-options/src/sandbox/sandboxConfigBus';

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
      currentCarrierConfig = CarrierConfigurationFactory.create(carrier.name, platform);
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
        key: `${CONFIG.KEY}.${CONFIG.CARRIER_SETTINGS}.${carrier.name}`,
        carrier: {
          name: carrier.name,
          text: carrier.label,
          image: carrier.image,
        },
      },
    ];
  }, []);
}
