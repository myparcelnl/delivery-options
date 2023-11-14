import {CONFIG} from '@myparcel-do/shared';

/**
 * These parameters are optional. If their respective settings are not defined by the user they are not added to the
 * parameters to use the default values from the API.
 *
 */
export const getOptionalRequestParameters = (configBus = realConfigBus) => {
  const dropOffDays = configBus.get(CONFIG.DROP_OFF_DAYS);

  return {
    deliverydays_window: configBus.get(CONFIG.DELIVERY_DAYS_WINDOW),
    // Convert dropOffDays to a semicolon separated string if needed
    dropoff_days: Array.isArray(dropOffDays) ? dropOffDays.join(';') : dropOffDays,
    dropoff_delay: configBus.get(CONFIG.DROP_OFF_DELAY),
  };
};
