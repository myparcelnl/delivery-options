import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';

/**
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 *
 * @returns {AbstractCarrierConfiguration|null}
 */
export function getCarrierConfiguration(args) {
  let carrierConfiguration = null;

  if (args.carrier && args.platform) {
    carrierConfiguration = CarrierConfigurationFactory.create(args.carrier, args.platform);
  }

  return carrierConfiguration;
}
