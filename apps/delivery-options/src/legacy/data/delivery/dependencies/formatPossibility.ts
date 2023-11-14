/**
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} deliveryPossibility
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies['moment']}
 */
export const formatPossibility = (deliveryPossibility) =>
  deliveryPossibility.delivery_time_frames.reduce(
    (acc, timeFrame) => ({
      ...acc,
      [timeFrame.type]: createLocaleString(timeFrame.date_time.date),
    }),
    {},
  );
