import type {PersistedSelectedValues} from '../types';
import {computed, ref, watch} from 'vue';
import {getPersistenceKey, getStorageItem, removeStorageItem, setStorageItem} from '../utils';
import {useAddressStore, useConfigStore} from '../stores';
import {HOME_OR_PICKUP_HOME} from '../data';
import {useSelectedValues} from './useSelectedValues';

/**
 * Sync the core selected delivery option values with localStorage.
 *
 * - On first "ready" for a given config+address combination, hydrate from storage if present.
 * - Whenever the selected values change, persist them under the same key.
 * - When the values are effectively reset to their initial state, clear the stored entry.
 */
// eslint-disable-next-line max-lines-per-function
export const usePersistedSelectedValues = (): void => {
  const {state: config} = useConfigStore();
  const {state: address} = useAddressStore();

  const {homeOrPickup, deliveryDate, deliveryMoment, shipmentOptions, pickupLocation, carrier} = useSelectedValues();

  const ready = computed<boolean>(() => Boolean(config.platform && (address as any).cc));
  const hydratedKey = ref<string | null>(null);
  const resolveKey = (): string => getPersistenceKey(config, address);

  const isInitialState = (values: PersistedSelectedValues): boolean => {
    const noShipmentOptions = !values.shipmentOptions || values.shipmentOptions.length === 0;

    return (
      values.homeOrPickup === HOME_OR_PICKUP_HOME &&
      !values.deliveryMoment &&
      noShipmentOptions &&
      !values.pickupLocation &&
      !values.carrier
    );
  };

  // 1. Hydrate once per key when the app becomes ready.
  watch(
    ready,
    (isReady) => {
      if (!isReady) {
        return;
      }

      const key = resolveKey();

      // Don't hydrate twice for the same key.
      if (hydratedKey.value === key) {
        return;
      }

      const stored = getStorageItem<PersistedSelectedValues>(key);

      if (stored) {
        if (stored.homeOrPickup) {
          homeOrPickup.value = stored.homeOrPickup;
        }

        if (stored.deliveryDate !== undefined) {
          deliveryDate.value = stored.deliveryDate;
        }

        if (stored.deliveryMoment !== undefined) {
          deliveryMoment.value = stored.deliveryMoment;
        }

        if (stored.shipmentOptions !== undefined) {
          // Clone to avoid mutating the array reference from storage.
          shipmentOptions.value = [...stored.shipmentOptions];
        }

        if (stored.pickupLocation !== undefined) {
          pickupLocation.value = stored.pickupLocation;
        }

        if (stored.carrier !== undefined) {
          carrier.value = stored.carrier;
        }
      }

      hydratedKey.value = key;
    },
    {immediate: true},
  );

  // 2. Persist whenever the selected values change.
  watch(
    () => ({
      homeOrPickup: homeOrPickup.value,
      deliveryDate: deliveryDate.value,
      deliveryMoment: deliveryMoment.value,
      shipmentOptions: shipmentOptions.value,
      pickupLocation: pickupLocation.value,
      carrier: carrier.value,
    }),
    (current) => {
      if (!ready.value) {
        return;
      }

      const key = resolveKey();

      const data: PersistedSelectedValues = {
        homeOrPickup: current.homeOrPickup,
        deliveryDate: current.deliveryDate,
        deliveryMoment: current.deliveryMoment,
        shipmentOptions: current.shipmentOptions?.length ? [...current.shipmentOptions] : undefined,
        pickupLocation: current.pickupLocation,
        carrier: current.carrier,
      };

      if (isInitialState(data)) {
        removeStorageItem(key);
        return;
      }

      setStorageItem(key, data);
    },
    {deep: true},
  );
};
