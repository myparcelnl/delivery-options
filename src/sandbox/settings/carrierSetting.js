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
      // The error means a carrier received from /carriers isn't supported (yet), which is fine.
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(e);
      }

      return acc;
    }

    const allowedInCarrier = currentCarrierConfig.hasFeature(setting.name);

    if (allowedInCarrier) {
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
    }

    return acc;
  }, []);
}
