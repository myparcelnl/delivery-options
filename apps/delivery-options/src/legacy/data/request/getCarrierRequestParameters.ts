import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { FEATURES_SAME_DAY_DELIVERY } from '@/data/carrierFeatures';
import { getSameDayDropOffDelay } from './getSameDayDropOffDelay';

/**
 * @param {AbstractCarrierConfiguration} carrierConfiguration
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export function getCarrierRequestParameters(carrierConfiguration) {
  const hasSameDayDelivery = carrierConfiguration.hasFeature(FEATURES_SAME_DAY_DELIVERY);

  return {
    ...hasSameDayDelivery ? getSameDayDropOffDelay(carrierConfiguration?.getName()) : {},
  };
}
