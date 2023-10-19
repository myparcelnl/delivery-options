import * as CONFIG from '@/data/keys/configKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

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
        key: `${CONFIG.KEY}.${CONFIG.CARRIER_SETTINGS}.${carrier.identifier}`,
        carrier: {
          name: carrier.identifier,
          text: carrier.label,
          image: carrier.image,
        },
      },
    ];
  }, []);
}
