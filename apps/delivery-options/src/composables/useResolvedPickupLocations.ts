import {ref, toValue, onUnmounted, computed, type ComputedRef, type Ref, type MaybeRefOrGetter} from 'vue';
import {useMemoize, watchImmediate} from '@vueuse/core';
import {type PickupLocation} from '@myparcel-dev/sdk';
import {
  PickupLocationType,
  usePickupLocationsRequest,
  computedAsync,
  type ComputedAsync,
  usePickupLocationsByLatLngRequest,
  ConfigSetting,
  addLoadingProperties,
  watchUntil,
} from '@myparcel-dev/do-shared';
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

  if (!locations.length) {
    return [];
  }

  return locations.map((location) => formatPickupLocation(carrier, location as PickupLocation));
};

const buildCurrentLocations = (
  carriersWithPickup: ComputedRef<UseResolvedCarrier[]>,
  latLng: Ref<LatLng>,
  allowLoadMore: MaybeRefOrGetter<boolean | undefined>,
): ComputedAsync<ResolvedPickupLocation[]> =>
  computedAsync<ResolvedPickupLocation[]>(async () => {
    const requests = toValue(carriersWithPickup)
      .filter(() => !toValue(latLng) || toValue(allowLoadMore) !== false)
      .map((carrier) => loadPickupLocations(carrier, latLng.value));

    const foundLocations = await Promise.all(requests);

    return foundLocations.flat(1);
  }, []);

const accumulateLocations = (
  allLocations: Ref<ResolvedPickupLocation[]>,
  currentLocations: ComputedAsync<ResolvedPickupLocation[]>,
) =>
  watchImmediate(currentLocations, (newLocations) => {
    const duplicatesFiltered = allLocations.value.filter(
      (location) => !newLocations.some((newLocation) => location.locationCode === newLocation.locationCode),
    );

    allLocations.value = [...duplicatesFiltered, ...newLocations];
  });

const callback = (): UseResolvedPickupLocations => {
  const latLng = ref<LatLng>(undefined);

  const allLocations = ref<ResolvedPickupLocation[]>([]);
  const {state: config} = useConfigStore();

  const activeCarriers = useActiveCarriers();

  const carriersWithPickup = computed((): UseResolvedCarrier[] => {
    return activeCarriers.value.filter((carrier) => toValue(carrier.hasPickup));
  });

  const currentLocations = buildCurrentLocations(
    carriersWithPickup,
    latLng,
    () => config[ConfigSetting.PickupMapAllowLoadMore],
  );

  const unwatchLocations = accumulateLocations(allLocations, currentLocations);

  const locations = addLoadingProperties(
    computed(() => {
      const {excludeParcelLockers} = config;

      const base = allLocations.value
        .filter((location) =>
          carriersWithPickup.value.some(({carrier}) => carrier.value.identifier === location.carrier),
        )
        .sort(sortByDistance);

      return excludeParcelLockers ? base.filter((location) => location.type !== PickupLocationType.Locker) : base;
    }),
    currentLocations.load,
    currentLocations.loading,
  );

  const loadMoreLocations = async (latitude: number, longitude: number): Promise<void> => {
    latLng.value = [latitude, longitude];

    return watchUntil(locations.loading, {condition: (loading) => !loading});
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
