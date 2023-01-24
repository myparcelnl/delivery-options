import { FEATURE_PICKUP_SHOW_DISTANCE } from '../../data/keys/configKeys';
import { configBus } from '../../config/configBus';

/**
 * Sort the given pickup locations by distance from low to high, if distance is enabled. Otherwise sort alphabetically
 *  by location name.
 *
 * @param {Array} pickupLocations - Response array from /pickup_locations.
 *
 * @returns {MyParcelDeliveryOptions.PickupLocation[]}
 */
export function sortPickupLocations(pickupLocations) {
  const hasDistance = configBus.isEnabled(FEATURE_PICKUP_SHOW_DISTANCE);

  return pickupLocations.sort(({ location: locationA }, { location: locationB }) => {
    if (hasDistance) {
      return locationA.distance - locationB.distance;
    }

    return locationA.location_name < locationB.location_name ? -1 : 1;
  });
}
