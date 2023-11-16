/**
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 *
 * @returns {AbstractCarrierConfiguration|null}
 */
export function getCarrierConfiguration(args) {
  let carrierConfiguration = null;

  if (args.carrier && args.platform) {
    carrierConfiguration = getCarrierConfiguration(args.carrier, args.platform);
  }

  return carrierConfiguration;
}
