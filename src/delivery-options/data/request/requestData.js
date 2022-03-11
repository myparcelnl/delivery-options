import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { getCutoffTime } from '@/helpers/delivery/getCutoffTime';
import { getDropOffDelayParameter } from '@/delivery-options/data/request/getDropOffDelayParameter';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

const getParametersForNL = (configBus) => ({
  monday_delivery: Number(configBus.get(CONFIG.ALLOW_MONDAY_DELIVERY, null, configBus.currentCarrier)),
});

const getParametersForBE = (configBus) => ({
  /*
   * TODO:
   *  See https://jira.dmp.zone/browse/MY-12648
   *   > "Day-picker is nog niet van toepassing voor SendMyParcel. De data die
   *     terugkomt is zelf opgebouwd door JW en komt niet officieel uit bpost/DPD."
   *  When this is no longer relevant this override can be removed.
   */
  deliverydays_window: 1,
  saturday_delivery: Number(configBus.get(CONFIG.ALLOW_SATURDAY_DELIVERY, null, configBus.currentCarrier)),
});

const parametersByPlatform = {
  [MYPARCEL]: getParametersForNL,
  [SENDMYPARCEL]: getParametersForBE,
};

/**
 * Get the request parameters for the given platform.
 *
 * @param carrier
 * @param {MyParcel.Platform} platform - Platform name.
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {DeliveryOptionsRequestParameters}
 */
export function getParametersByPlatform(carrier, platform = realConfigBus.get(CONFIG.PLATFORM), configBus = realConfigBus) {
  return {
    ...parametersByPlatform[platform](configBus),
    cutoff_time: getCutoffTime(configBus),
    ...getDropOffDelayParameter(carrier, configBus),
  };
}
