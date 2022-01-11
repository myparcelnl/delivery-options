/**
 * @param {string[]} required
 *
 * @returns {MyParcelDeliveryOptions.ShipmentOption[]}
 */
export function getShipmentOptions(required = []) {
  const option = (name) => ({
    name,
    schema: {
      type: 'boolean',
      enum: required.includes(name) ? [true] : [true, false],
    },
  });

  return [
    option('age_check'),
    option('large_format'),
    option('only_recipient'),
    option('return'),
    option('same_day_delivery'),
    option('signature'),
  ];
}
