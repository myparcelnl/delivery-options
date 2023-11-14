import {CONFIG, MYPARCEL, SENDMYPARCEL} from '@myparcel-do/shared';

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

/** .................................................
 * Get the request parameters for the given platform.
 *
 */
export function getParametersByPlatform(configBus = realConfigBus) {
  const platform = configBus.get(CONFIG.PLATFORM);

  return {
    ...parametersByPlatform[platform](configBus),
    cutoff_time: getCutoffTime(configBus),
  };
}
