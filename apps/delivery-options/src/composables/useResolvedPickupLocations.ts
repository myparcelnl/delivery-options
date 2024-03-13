import {get, useMemoize} from '@vueuse/core';
import {PickupLocationType, usePickupLocationsRequest, computedAsync} from '@myparcel-do/shared';
import {type PickupLocation} from '@myparcel/sdk';
import {DeliveryTypeName} from '@myparcel/constants';
import {createGetDeliveryOptionsParameters} from '../utils';
import {type ResolvedCarrier, type ResolvedPickupLocation} from '../types';
import {useActiveCarriers} from './useActiveCarriers';

const sortByDistance = (locationA: ResolvedPickupLocation, locationB: ResolvedPickupLocation): number => {
  return Number(locationA.distance) - Number(locationB.distance);
};

const formatPickupLocation = (carrier: ResolvedCarrier, option: PickupLocation): ResolvedPickupLocation => {
  const {location, address} = option;

  return {
    carrier: carrier.identifier,

    type: option.address.number_suffix === 'PBA' ? PickupLocationType.Locker : PickupLocationType.Default,
    distance: Number(location.distance),

    retailNetworkId: location.retail_network_id,
    locationCode: location.location_code,
    locationName: location.location_name,

    latitude: Number(location.latitude),
    longitude: Number(location.longitude),

    street: address.street,
    number: address.number,
    numberSuffix: '',
    postalCode: address.postal_code,
    city: address.city,
    cc: address.cc,

    openingHours: Object.values(location.opening_hours)
      .filter((hours) => hours.length > 0)
      .map((hours, weekday) => ({hours, weekday})),
  };
};

const loadPickupLocations = async (carrier: ResolvedCarrier) => {
  const params = createGetDeliveryOptionsParameters(carrier);
  const query = usePickupLocationsRequest(params);

  await query.load();

  const locations = get(query.data) ?? [];

  if (!locations.length) {
    // Delete the pickup delivery type if there are no pickup locations to hide pickup after a failed request
    carrier.disabledDeliveryTypes.value.add(DeliveryTypeName.Pickup);
    return [];
  }

  return locations.map((location) => formatPickupLocation(carrier, location as PickupLocation));
};

export const useResolvedPickupLocations = useMemoize(() => {
  const carriers = useActiveCarriers();

  return computedAsync<ResolvedPickupLocation[]>(async () => {
    const result = await Promise.all(
      get(carriers)
        .filter((carrier) => get(carrier.hasPickup))
        .map(loadPickupLocations),
    );

    return result.map((locations) => locations.sort(sortByDistance)).flat(1);
  }, []);
});
