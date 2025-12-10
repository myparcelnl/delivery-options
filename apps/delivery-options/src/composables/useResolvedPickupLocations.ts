import {ref, toValue, onUnmounted, computed, type ComputedRef, watch} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  PickupLocationType,
  usePickupLocationsRequest,
  computedAsync,
  type ComputedAsync,
  usePickupLocationsByLatLngRequest,
  ConfigSetting,
  addLoadingProperties,
  watchUntil,
} from '@myparcel-dev/shared';
import {type PickupLocation} from '@myparcel-dev/sdk';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {getHasPickupForPackage} from '../utils/getHasPickupForPackage';
import {createLatLngParameters, createGetDeliveryOptionsParameters} from '../utils';
import {type ResolvedPickupLocation, type LatLng} from '../types';
import {useConfigStore} from '../stores';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {useActiveCarriers} from './useActiveCarriers';

interface UseResolvedPickupLocations {
  carriersWithPickup: ComputedRef<UseResolvedCarrier[]>;
  locations: ComputedAsync<ResolvedPickupLocation[]>;

  /**
   * Load more locations by latitude and longitude.
   */
  loadMoreLocations(latitude: number, longitude: number): Promise<void>;

  /**
   * Clear all previously loaded locations.
   */
  reset(): void;
}

const sortByDistance = (locationA: ResolvedPickupLocation, locationB: ResolvedPickupLocation): number => {
  return Number(locationA.distance) - Number(locationB.distance);
};

const formatPickupLocation = (carrier: UseResolvedCarrier, option: PickupLocation): ResolvedPickupLocation => {
  const {location, address} = option;

  return {
    carrier: carrier.carrier.value.identifier,

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

const loadPickupLocations = async (carrier: UseResolvedCarrier, latLng?: LatLng) => {
  const latLngParameters = createLatLngParameters(latLng);
  const params = createGetDeliveryOptionsParameters(carrier, latLngParameters);

  const query = latLng ? usePickupLocationsByLatLngRequest(params) : usePickupLocationsRequest(params);

  await query.load();

  const locations = toValue(query.data) ?? [];

  if (!latLng && !locations.length) {
    // Delete the pickup delivery type if there are no pickup locations to hide pickup after a failed request
    carrier.disabledDeliveryTypes.value.add(DeliveryTypeName.Pickup);
    return [];
  }

  return locations.map((location) => formatPickupLocation(carrier, location as PickupLocation));
};

// eslint-disable-next-line max-lines-per-function
const callback = (): UseResolvedPickupLocations => {
  const carriers = useActiveCarriers();
  const latLng = ref<LatLng>(undefined);

  const allLocations = ref<ResolvedPickupLocation[]>([]);
  const {state: config} = useConfigStore();

  const carriersWithPickup = computed(() => {
    const list = toValue(carriers);
    const filtered = list.filter((carrier) => getHasPickupForPackage(carrier, config.packageType));
    return filtered;
  });

  const currentLocations = computedAsync<ResolvedPickupLocation[]>(
    async () => {
      const carriersList = toValue(carriersWithPickup);
      const requests = carriersList
        // When using latLng, only load more locations for carriers that allow it
        .filter((carrier) => {
          if (!toValue(latLng)) {
            return true;
          }

          return toValue(carrier.features).has(ConfigSetting.PickupMapAllowLoadMore);
        })
        .map((carrier) => loadPickupLocations(carrier, latLng.value));

      const foundLocations = await Promise.all(requests);

      return foundLocations.flat(1);
    },
    undefined,
  );

  /**
   * Add new locations to the list of all locations.
   */
  const unwatchLocations = watch(
    currentLocations,
    (newLocations) => {
      if (!newLocations || !Array.isArray(newLocations)) {
        return;
      }

      const duplicatesFiltered = allLocations.value.filter((location) => {
        return !newLocations.some((newLocation) => location.locationCode === newLocation.locationCode);
      });

      allLocations.value = [...duplicatesFiltered, ...newLocations];
    },
    {immediate: true, deep: true},
  );

  const locations = addLoadingProperties(
    computed(() => {
      const {excludeParcelLockers} = config;

      const base = allLocations.value
        .filter((location) =>
          carriersWithPickup.value.some(({carrier}) => carrier.value.identifier === location.carrier),
        )
        .sort(sortByDistance);

      return excludeParcelLockers
        ? base.filter((location) => location.type !== PickupLocationType.Locker)
        : base;
    }),
    async () => {
      await currentLocations.load();
      // Manually trigger watcher after load
      const newLocations = currentLocations.value;
      if (newLocations && Array.isArray(newLocations)) {
        const duplicatesFiltered = allLocations.value.filter((location) => {
          return !newLocations.some((newLocation) => location.locationCode === newLocation.locationCode);
        });
        allLocations.value = [...duplicatesFiltered, ...newLocations];
      }
    },
    currentLocations.loading,
  );

  const loadMoreLocations = async (latitude: number, longitude: number): Promise<void> => {
    latLng.value = [latitude, longitude];

    await watchUntil(locations.loading, {condition: (loading) => !loading});

    // Manually add new locations after loading
    const newLocations = currentLocations.value;
    if (newLocations && Array.isArray(newLocations)) {
      const duplicatesFiltered = allLocations.value.filter((location) => {
        return !newLocations.some((newLocation) => location.locationCode === newLocation.locationCode);
      });
      allLocations.value = [...duplicatesFiltered, ...newLocations];
    }
  };

  onUnmounted(unwatchLocations);

  return {
    carriersWithPickup,
    locations,

    loadMoreLocations,
    reset() {
      allLocations.value = [];
    },
  };
};

export const useResolvedPickupLocations = useMemoize(callback);
