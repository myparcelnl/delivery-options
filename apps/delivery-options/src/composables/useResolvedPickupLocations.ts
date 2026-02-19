import {ref, toValue, onUnmounted, computed, type ComputedRef} from 'vue';
import {useMemoize, watchImmediate} from '@vueuse/core';
import {type PickupLocation} from '@myparcel-dev/sdk';
import {
  PickupLocationType,
  usePickupLocationsRequest,
  computedAsync,
  type ComputedAsync,
  usePickupLocationsByLatLngRequest,
  ConfigSetting,
  CarrierSetting,
  addLoadingProperties,
  watchUntil,
  useCapabilities,
  normalizeCarrierName,
  mapPackageTypeToCapability,
  type CarrierIdentifier,
} from '@myparcel-dev/do-shared';
import {getResolvedCarrier, createLatLngParameters, createGetDeliveryOptionsParameters} from '../utils';
import {type ResolvedPickupLocation, type LatLng} from '../types';
import {useAddressStore, useConfigStore} from '../stores';
import {type UseResolvedCarrier} from './useResolvedCarrier';

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

const getResolvedValue = (key: string, carrierIdentifier?: CarrierIdentifier) => {
  const {state: config} = useConfigStore();
  const generalValue = config[key as keyof typeof config];

  if (!carrierIdentifier) {
    return generalValue;
  }

  const carrierValue = config.carrierSettings?.[carrierIdentifier]?.[key as keyof typeof config.carrierSettings];

  return carrierValue ?? generalValue;
};

// eslint-disable-next-line max-lines-per-function
const callback = (): UseResolvedPickupLocations => {
  const latLng = ref<LatLng>(undefined);

  const allLocations = ref<ResolvedPickupLocation[]>([]);
  const {state: config} = useConfigStore();
  const {state: address} = useAddressStore();

  /**
   * Determine carriers with pickup directly from capabilities + config.
   * This avoids relying on the deep reactive chain through useActiveCarriers → hasPickup.
   */
  const carriersWithPickup = computed((): UseResolvedCarrier[] => {
    const capPackageType = mapPackageTypeToCapability(config.packageType);
    const capabilities = useCapabilities(config.apiBaseUrl, address.cc, capPackageType);
    const configCarriers = Object.keys(config.carrierSettings ?? {}) as CarrierIdentifier[];

    return configCarriers
      .filter((identifier) => {
        const carrierPart = identifier.split(':')[0] ?? identifier;
        const normalized = normalizeCarrierName(carrierPart);
        const capability = capabilities.getCarrierCapability(normalized);

        if (!capability) {
          return false;
        }

        const hasPickupInCapabilities = capability.deliveryTypes.includes('PICKUP_DELIVERY');
        const allowPickup = Boolean(getResolvedValue(CarrierSetting.AllowPickupLocations, identifier));

        return hasPickupInCapabilities && allowPickup;
      })
      .map((identifier) => getResolvedCarrier(identifier, address.cc, config.apiBaseUrl, capPackageType));
  });

  const currentLocations = computedAsync<ResolvedPickupLocation[]>(async () => {
    const requests = toValue(carriersWithPickup)
      // When using latLng, only load more locations for carriers that allow it
      .filter(() => {
        if (!toValue(latLng)) {
          return true;
        }

        return config[ConfigSetting.PickupMapAllowLoadMore] !== false;
      })
      .map((carrier) => loadPickupLocations(carrier, latLng.value));

    const foundLocations = await Promise.all(requests);

    return foundLocations.flat(1);
  }, []);

  /**
   * Add new locations to the list of all locations.
   */
  const unwatchLocations = watchImmediate(currentLocations, (newLocations) => {
    const duplicatesFiltered = allLocations.value.filter((location) => {
      return !newLocations.some((newLocation) => location.locationCode === newLocation.locationCode);
    });

    allLocations.value = [...duplicatesFiltered, ...newLocations];
  });

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
