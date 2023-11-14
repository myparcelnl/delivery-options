/**
 * Format the pickup locations responses.
 *
 * @param {Array} pickupLocations - Responses array from pickup locations request.
 *
 * @returns {MyParcel.PickupLocation[]}
 */
export function formatPickupLocations(pickupLocations) {
  return pickupLocations.map(({carrier, location, address, possibilities}) => {
    const {retail_network_id, location_code, location_name} = location;

    return {
      carrier,
      location_name,
      location_code,
      retail_network_id,
      possibilities,
      ...address,
    };
  });
}
